// routes/blockFloorRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    addBlock,
    addFloor,
    listProjectStructure
} = require('../controllers/blockFloorController');

// Add a block to a project
router.post('/blocks', authMiddleware, addBlock);

// Add a floor to a block
router.post('/floors', authMiddleware, addFloor);

// List project structure (blocks + floors)
router.get('/projects/:projectId/structure', authMiddleware, listProjectStructure);

module.exports = router;
