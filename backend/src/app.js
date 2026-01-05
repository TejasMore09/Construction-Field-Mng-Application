// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

//  Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//  Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api', projectRoutes); // project APIs

const blockFloorRoutes = require('./routes/blockFloorRoutes');
app.use('/api', blockFloorRoutes);

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // optional if used elsewhere
