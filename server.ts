import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Initialize Firebase Admin (Requires FIREBASE_SERVICE_ACCOUNT_KEY env var)
let db: Firestore | null = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    const app = !getApps().length
      ? initializeApp({
          credential: cert(serviceAccount),
        })
      : getApps()[0];
    
    // Connect to specific firestoreDatabaseId if configured or default
    const databaseId = "ai-studio-mediluxecommerce-7b59eb56-0ddc-48ee-8383-58a99ca7daa0";
    try {
      db = getFirestore(app, databaseId);
    } catch {
      db = getFirestore(app);
    }
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

  // API Route for Telegram Notification
  app.post("/api/notify-telegram", async (req, res) => {
    const { order, telegramBotToken, telegramChatId } = req.body;

    // Get token from body or environment variable
    const botToken = telegramBotToken || order?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = telegramChatId || order?.telegramChatId || process.env.TELEGRAM_CHAT_ID || "6642818516";

    if (!botToken) {
      console.warn("TELEGRAM_BOT_TOKEN is not defined in env or settings. Skipping Telegram notification.");
      return res.status(200).json({ 
        success: false, 
        message: "Telegram bot token is not configured yet. Add it in Admin Settings > Store & Telegram or set TELEGRAM_BOT_TOKEN env variable." 
      });
    }

    if (!order) {
      return res.status(400).json({ error: "Order data is missing" });
    }

    try {
      // Safely escape HTML characters
      const escapeHtml = (text: string | number | undefined | null) => {
        if (text === undefined || text === null) return "";
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      };

      // Format the items
      const orderItems = (order.items || []).map((item: any) => 
        `• <b>${escapeHtml(item.name)}</b> × ${item.quantity}\n  ৳${item.price} each (৳${item.price * item.quantity})`
      ).join('\n\n');

      const formattedDate = order.createdAt 
        ? new Date(order.createdAt).toLocaleString('en-BD', {
            timeZone: 'Asia/Dhaka',
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

      const text = `🛍️ <b>NEW MEDILUX ORDER RECEIVED!</b>\n\n` +
        `🆔 <b>Order ID:</b> #${escapeHtml(order.orderNumber)}\n` +
        `📦 <b>Status:</b> ${escapeHtml((order.status || 'new').toUpperCase())}\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 <b>CUSTOMER DETAILS</b>\n` +
        `• <b>Name:</b> ${escapeHtml(order.customerName)}\n` +
        `• <b>Phone:</b> ${escapeHtml(order.customerPhone)}\n` +
        (order.customerEmail ? `• <b>Email:</b> ${escapeHtml(order.customerEmail)}\n` : '') +
        `• <b>City:</b> ${escapeHtml(order.city || 'Dhaka')}\n` +
        `• <b>Address:</b> ${escapeHtml(order.streetAddress)}\n` +
        (order.notes ? `• <b>Notes:</b> ${escapeHtml(order.notes)}\n` : '') +
        `\n━━━━━━━━━━━━━━━━━━\n\n` +
        `🛒 <b>ITEMS ORDERED</b>\n\n` +
        `${orderItems}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `💰 <b>PAYMENT & BILLING</b>\n` +
        `• Subtotal: ৳${order.subtotal}\n` +
        `• Delivery: ৳${order.deliveryFee}\n` +
        `• <b>TOTAL: ৳${order.total}</b>\n` +
        `• Payment: <b>${order.paymentMethod === 'cod' ? 'Cash on Delivery' : escapeHtml(order.paymentMethod?.toUpperCase())}</b>\n` +
        `• Time: ${escapeHtml(formattedDate)}`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML"
        })
      });

      const responseData: any = await response.json();
      if (!response.ok || !responseData.ok) {
        console.error("Telegram API Error response:", responseData);
        return res.status(200).json({ 
          success: false, 
          error: responseData.description || "Telegram API rejected message" 
        });
      }

      console.log(`Telegram notification sent successfully for order #${order.orderNumber}`);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Failed to send telegram notification:", err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  // API Route for Testing Telegram Bot directly from Admin Panel
  app.post("/api/test-telegram", async (req, res) => {
    const { botToken: customToken, chatId: customChatId } = req.body;
    const botToken = customToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = customChatId || process.env.TELEGRAM_CHAT_ID || "6642818516";

    if (!botToken) {
      return res.status(400).json({ 
        success: false, 
        error: "Telegram Bot Token is missing. Please provide it or configure in Admin Settings." 
      });
    }

    try {
      const testMessage = `🌿 <b>MEDILUX TELEGRAM BOT TEST</b>\n\n` +
        `✅ Telegram notifications are now active and working properly!\n` +
        `⏰ Time: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}\n` +
        `⚡ Store: Medilux Pure Formulations`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: "HTML"
        })
      });

      const data: any = await response.json();
      if (!response.ok || !data.ok) {
        return res.status(400).json({ 
          success: false, 
          error: data.description || "Telegram bot rejected the message" 
        });
      }

      return res.status(200).json({ success: true, message: "Telegram test message sent successfully!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
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
