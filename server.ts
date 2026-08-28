import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON body
  app.use(express.json());

  // API Route for Telegram Notification
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
