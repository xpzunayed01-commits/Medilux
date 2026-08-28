import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as admin from "firebase-admin";

// Initialize Firebase Admin (Requires FIREBASE_SERVICE_ACCOUNT_KEY env var)
let db: admin.firestore.Firestore | null = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    // Fallback to default database if specific databaseId is not needed, or configure it:
    db = admin.firestore();
    // For specific database ID, use: db = admin.firestore("ai-studio-mediluxecommerce-...");
    // But since it's the main db in AI Studio usually, admin.firestore() might work if it's the default.
  }
} catch (e) {
  console.warn("Failed to initialize Firebase Admin:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side order creation (Secure Price Validation)
  app.post("/api/create-order", async (req, res) => {
    if (!db) {
      return res.status(500).json({ error: "Server misconfiguration: FIREBASE_SERVICE_ACCOUNT_KEY is missing." });
    }

    try {
      const { items, customerDetails, paymentMethod, city, notes } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order items" });
      }

      // 1. Fetch actual prices from database
      let calculatedSubtotal = 0;
      const validatedItems = [];

      for (const item of items) {
        if (item.quantity <= 0 || item.quantity > 50) {
          return res.status(400).json({ error: "Invalid quantity detected" });
        }

        const productRef = db.collection('products').doc(item.productId);
        const productSnap = await productRef.get();

        if (!productSnap.exists) {
          return res.status(400).json({ error: `Product ${item.productId} not found` });
        }

        const productData = productSnap.data();
        if (!productData) continue;

        const actualPrice = productData.price;
        calculatedSubtotal += actualPrice * item.quantity;

        validatedItems.push({
          productId: item.productId,
          name: productData.name,
          price: actualPrice, // FORCE server price
          quantity: item.quantity,
          image: productData.image || item.image
        });
      }

      // 2. Fetch site settings for delivery fee
      let deliveryFee = 0;
      const settingsSnap = await db.collection('site_settings').doc('store_settings').get();
      if (settingsSnap.exists) {
        const settings = settingsSnap.data();
        if (settings) {
          const isInsideDhaka = city.trim().toLowerCase().includes('dhaka');
          const baseDeliveryFee = isInsideDhaka
            ? (settings.deliveryFeeInsideDhaka ?? 80)
            : (settings.deliveryFeeOutsideDhaka ?? 150);
            
          const isFreeDelivery = (settings.freeDeliveryThreshold && calculatedSubtotal >= settings.freeDeliveryThreshold);
          deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
        }
      }

      const finalTotal = calculatedSubtotal + deliveryFee;

      // 3. Create the order document securely
      const orderNumber = String(Math.floor(100000 + Math.random() * 900000));
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email || '',
        streetAddress: customerDetails.streetAddress,
        city: city,
        postalCode: customerDetails.postalCode || '',
        notes: notes || '',
        items: validatedItems,
        subtotal: calculatedSubtotal,
        deliveryFee: deliveryFee,
        total: finalTotal,
        paymentMethod: paymentMethod,
        status: 'new',
        telegramNotificationSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection('orders').add(newOrder);
      newOrder.id = docRef.id;

      // 4. Update stock securely
      for (const item of validatedItems) {
        const prodRef = db.collection('products').doc(item.productId);
        await db.runTransaction(async (t) => {
          const doc = await t.get(prodRef);
          if (doc.exists) {
            const currentStock = doc.data()?.stock ?? 25;
            const newStock = Math.max(0, currentStock - item.quantity);
            t.update(prodRef, { stock: newStock, isOutOfStock: newStock === 0 });
          }
        });
      }

      // 5. Telegram Notification (Secondary)
      try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "6642818516";
        
        if (TELEGRAM_BOT_TOKEN) {
          // ... formatting ...
          const orderItemsFormatted = newOrder.items.map((item: any) => 
            `• ${item.name} × ${item.quantity}\n  Price: ৳${item.price * item.quantity}`
          ).join('\n\n');

          const escapeHtml = (text: string) => String(text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

          const text = `🛍️ <b>NEW ORDER RECEIVED</b>\n\n━━━━━━━━━━━━━━━━━━\n\n🆔 <b>Order ID:</b> #${escapeHtml(newOrder.orderNumber)}\n\n👤 <b>CUSTOMER</b>\nName: ${escapeHtml(newOrder.customerName)}\nPhone: ${escapeHtml(newOrder.customerPhone)}\n\n📍 <b>DELIVERY ADDRESS</b>\nAddress: ${escapeHtml(newOrder.streetAddress)}\nCity: ${escapeHtml(newOrder.city)}\n${newOrder.notes ? `\n📝 <b>Notes:</b> ${escapeHtml(newOrder.notes)}` : ''}\n\n━━━━━━━━━━━━━━━━━━\n\n🛒 <b>ORDER ITEMS</b>\n\n${escapeHtml(orderItemsFormatted)}\n\n━━━━━━━━━━━━━━━━━━\n\n💰 <b>ORDER SUMMARY</b>\n\nSubtotal: ৳${newOrder.subtotal}\nDelivery Fee: ৳${newOrder.deliveryFee}\n<b>TOTAL: ৳${newOrder.total}</b>\n\n💳 <b>Payment Method:</b>\n${newOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : escapeHtml(newOrder.paymentMethod.toUpperCase())}\n\n📦 <b>Order Status:</b>\nNew\n\n━━━━━━━━━━━━━━━━━━\n\n🔗 <b>Order ID:</b> #${escapeHtml(newOrder.orderNumber)}`;

          const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" })
          });

          if (tgRes.ok) {
            await docRef.update({ telegramNotificationSent: true });
            newOrder.telegramNotificationSent = true;
          }
        }
      } catch (tgErr) {
        console.error("Telegram error:", tgErr);
      }

      return res.status(200).json({ success: true, order: newOrder });

    } catch (error) {
      console.error("Order creation error:", error);
      return res.status(500).json({ error: "Failed to create order securely" });
    }
  });

  // API Route for Telegram Notification (Legacy/Fallback)
  app.post("/api/notify-telegram", async (req, res) => {
    // SECURITY: Get token from environment variable
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "6642818516";

    if (!TELEGRAM_BOT_TOKEN) {
      console.warn("TELEGRAM_BOT_TOKEN is not defined in environment variables. Skipping Telegram notification.");
      // We return success anyway so the client order flow isn't interrupted,
      // but we indicate the notification wasn't sent.
      return res.status(200).json({ success: false, message: "Telegram not configured" });
    }

    const { order } = req.body;

    if (!order) {
      return res.status(400).json({ error: "Order data is missing" });
    }

    try {
      // Format the items
      const orderItems = order.items.map((item: any) => 
        `• ${item.name} × ${item.quantity}\n  Price: ৳${item.price * item.quantity}`
      ).join('\n\n');

      // Safely handle special characters in HTML parse_mode
      const escapeHtml = (text: string) => {
        if (!text) return "";
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      };

      const formattedDate = new Date(order.createdAt).toLocaleString('en-BD', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'long',
        timeStyle: 'short'
      });

      const text = `🛍️ <b>NEW ORDER RECEIVED</b>

━━━━━━━━━━━━━━━━━━

🆔 <b>Order ID:</b> #${escapeHtml(order.orderNumber)}

👤 <b>CUSTOMER</b>
Name: ${escapeHtml(order.customerName)}
Phone: ${escapeHtml(order.customerPhone)}

📍 <b>DELIVERY ADDRESS</b>
Address: ${escapeHtml(order.streetAddress)}
City: ${escapeHtml(order.city)}
${order.postalCode ? `Postal Code: ${escapeHtml(order.postalCode)}` : ''}
${order.notes ? `\n📝 <b>Notes:</b> ${escapeHtml(order.notes)}` : ''}

━━━━━━━━━━━━━━━━━━

🛒 <b>ORDER ITEMS</b>

${escapeHtml(orderItems)}

━━━━━━━━━━━━━━━━━━

💰 <b>ORDER SUMMARY</b>

Subtotal: ৳${order.subtotal}
Delivery Fee: ৳${order.deliveryFee}
<b>TOTAL: ৳${order.total}</b>

💳 <b>Payment Method:</b>
${order.paymentMethod === 'cod' ? 'Cash on Delivery' : escapeHtml(order.paymentMethod.toUpperCase())}

📦 <b>Order Status:</b>
${escapeHtml(order.status.charAt(0).toUpperCase() + order.status.slice(1))}

🕐 <b>Order Time:</b>
${escapeHtml(formattedDate)}

━━━━━━━━━━━━━━━━━━

🔗 <b>Order ID:</b> #${escapeHtml(order.orderNumber)}`;

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Telegram API error:", errorData);
        // Do not fail the request to block the client order flow. 
        // We log the error and return status 200 with success: false.
        return res.status(200).json({ success: false, error: "Telegram API error" });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error sending Telegram notification:", err);
      return res.status(200).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
