// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);


module.exports = app;
