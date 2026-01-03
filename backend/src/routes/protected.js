// src/routes/protected.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Anyone logged in
router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route working',
    user: req.user
  });
});

// Worker only
router.get('/worker', authMiddleware, (req, res) => {
  if (req.user.role !== 'worker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({
    message: 'Worker route working',
    user: req.user
  });
});

// Manager only
router.get('/manager', authMiddleware, (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({
    message: 'Manager route working',
    user: req.user
  });
});

// Owner only
router.get('/owner', authMiddleware, (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({
    message: 'Owner route working',
    user: req.user
  });
});

module.exports = router;
