const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

const readProducts = () => {
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeProducts = (products) => {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// Obtener todos los productos (público)
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Agregar producto (solo admin)
router.post('/', authMiddleware('admin'), (req, res) => {
  const { name, description, price, stock } = req.body;
  const products = readProducts();

  products.push({ id: Date.now(), name, description, price, stock });
  writeProducts(products);

  res.status(201).json({ message: 'Producto agregado' });
});

module.exports = router;