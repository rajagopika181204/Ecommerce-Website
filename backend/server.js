const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;
const JWT_SECRET = '123!@#';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS']
}));// Adjust for production
app.use(express.json());
app.use('/images', express.static('images')); // Serving static images



// MySQL connection
async function connectDB() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RYSF@rysf123',
    database: 'techstore',
  });
}

// SIGNUP Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const connection = await connectDB();
  try {
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Signup error', details: err.message });
  } finally {
    connection.end();
  }
});

// LOGIN Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const connection = await connectDB();
  try {
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: users[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  } finally {
    connection.end();
  }
});

// Fetch Products Route
app.get('/products', async (req, res) => {
  const conn = await connectDB();
  try {
    const [products] = await conn.execute('SELECT * FROM products WHERE quantity > 0');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  } finally {
    conn.end();
  }
});

// Update Stock Route
app.post('/api/update-stock', async (req, res) => {
  const { productId, quantityPurchased } = req.body;

  if (!productId || !Number.isInteger(quantityPurchased) || quantityPurchased <= 0) {
    return res.status(400).json({ error: 'Invalid product ID or quantity' });
  }

  const connection = await connectDB();
  try {
    await connection.beginTransaction();

    const [results] = await connection.execute(
      'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );

    if (results.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentQuantity = results[0].quantity;

    if (currentQuantity < quantityPurchased) {
      await connection.rollback();
      return res.status(400).json({ error: 'Not enough stock' });
    }

    await connection.execute(
      'UPDATE products SET quantity = quantity - ? WHERE id = ?',
      [quantityPurchased, productId]
    );
    await connection.commit();
    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Update failed', details: err.message });
  } finally {
    connection.end();
  }
});
app.post('/api/orders', async (req, res) => {
  const { items, userDetails, total, paymentMethod } = req.body;

  // Validate request body
  if (!items || !userDetails || !total || !paymentMethod) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const connection = await connectDB();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Generate transaction and tracking IDs
    const transactionId = `TXN${Date.now()}`;
    const trackingId = `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Insert into orders table
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (name, address, city, email, pincode, phone, payment_method, total_amount, transaction_id, tracking_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userDetails.name,
        userDetails.address,
        userDetails.city,
        userDetails.email,
        userDetails.pincode,
        userDetails.phone,
        paymentMethod,
        total,
        `TXN${Date.now()}`,
        `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert items into order_items table and update stock
    for (const item of items) {
      const totalAmount = item.quantity * item.product.price;

      // Insert order item
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price, total_price, product_name) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId, 
          item.product.id, 
          item.quantity, 
          item.product.price, 
          totalAmount, 
          item.product.name
        ]
      );

      // Check and update stock
      const [stockResult] = await connection.execute(
        `SELECT quantity FROM products WHERE id = ? FOR UPDATE`,
        [item.product.id]
      );

      const currentStock = stockResult[0]?.quantity;
      if (currentStock === undefined || currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product.name}`);
      }

      await connection.execute(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [item.quantity, item.product.id]
      );
    }

    // Commit transaction
    await connection.commit();

    // Send success response
    res.status(201).json({
      success: true,
      orderId,
      trackingId: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      transactionId: `TXN${Date.now()}`,
      userDetails,
      items,
      total,
      paymentMethod
    });
    console.log({
  orderId,
  userDetails,
  items,
  total,
  paymentMethod
});

  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Error creating order:', error.message || error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  } finally {
    // Ensure connection is closed
    connection.end();
  }
});



// Generate UPI Link Route
app.post('/api/generate-upi-link', (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ error: 'Amount and Order ID required' });
  }

  const upiId = '7598162840@axl'; // Replace with your UPI ID
  const upiLink = `upi://pay?pa=${upiId}&pn=TechStore&am=${amount}&tn=${orderId}&cu=INR`;

  res.json({ upiLink, qrData: upiLink });
});

let orders = []; // simple in-memory store

app.post("/api/billing", (req, res) => {
  const { items, totalAmount, customer } = req.body;

  if (!items || !totalAmount) {
    return res.status(400).json({ error: "Missing billing data" });
  }

  const orderId = orders.length + 1;
  const order = { orderId, items, totalAmount, customer, date: new Date() };
  orders.push(order);

  res.json({ message: "Order saved", orderId });
});

// Fetch Cart Items for a User
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const connection = await connectDB();

  try {
    const [cartItems] = await connection.execute(
      'SELECT c.product_id, p.name, p.price, p.image_url, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [userId]
    );
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  } finally {
    connection.end();
  }
});

// Save Cart Items for a User
app.post('/api/cart', async (req, res) => {
  const { userId, cartItems } = req.body;
  const connection = await connectDB();

  try {
    await connection.beginTransaction();

    // Clear existing cart items for the user
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Insert new cart items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, item.productId, item.quantity]
      );
    }

    await connection.commit();
    res.json({ message: 'Cart saved successfully' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to save cart', details: err.message });
  } finally {
    connection.end();
  }
});

app.post("/api/orders", async (req, res) => {
    const { userId, totalAmount, paymentMethod, items } = req.body;

    if (!userId || !totalAmount || !paymentMethod || !items) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const connection = await connectDB();
    try {
        await connection.beginTransaction();

        // Insert into orders table
        const [orderResult] = await connection.execute(
            "INSERT INTO orders (user_id, total_amount, payment_method, status) VALUES (?, ?, ?, ?)",
            [userId, totalAmount, paymentMethod, "pending"]
        );

        const orderId = orderResult.insertId;

        // Insert into order_items table
        for (const item of items) {
            await connection.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Order saved successfully", orderId });
    } catch (err) {
        await connection.rollback();
        console.error("Error saving order:", err);
        res.status(500).json({ error: "Failed to save order" });
    } finally {
        connection.end();
    }
});

app.get("/api/orders/:userId", async (req, res) => {
    const { userId } = req.params;

    const connection = await connectDB();
    try {
        // Fetch orders for the specific user
        const [orders] = await connection.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        // Fetch items for each order
        for (const order of orders) {
            const [items] = await connection.execute(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.id]
            );
            order.items = items; // Attach items to each order
        }

        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    } finally {
        connection.end();
    }
});


// Mock tracking data
const trackingData = {
  TRK123ABC: { status: "Shipped", expectedDelivery: "2025-06-15" },
  TRK456DEF: { status: "In Transit", expectedDelivery: "2025-06-18" },
};

// API endpoint for tracking
app.get("/track/:id", (req, res) => {
  const trackingID = req.params.id;
  const data = trackingData[trackingID];

  if (data) {
    res.json(data); // Return the tracking data
  } else {
    res.status(404).json({ error: "Tracking ID not found." });
  }
});


// Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});