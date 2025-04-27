const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

// Helper functions
const readOrders = () => {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

// Crear una nueva orden (accesible para clientes)
router.post('/', authMiddleware('customer'), (req, res) => {
  const { products, total } = req.body;
  const orders = readOrders();
  
  const newOrder = {
    id: Date.now(),
    userId: req.user.email,
    products,
    total,
    date: new Date().toISOString()
  };

  orders.push(newOrder);
  writeOrders(orders);
  res.status(201).json(newOrder);
});

// Obtener órdenes del usuario (cliente)
router.get('/my-orders', authMiddleware('customer'), (req, res) => {
  const orders = readOrders();
  const userOrders = orders.filter(order => order.userId === req.user.email);
  res.json(userOrders);
});

// Obtener todas las órdenes (admin)
router.get('/', authMiddleware('admin'), (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

module.exports = router;