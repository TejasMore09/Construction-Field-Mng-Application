// controllers/blockFloorController.js
const pool = require('../db');

// =======================
// 1️⃣ Add Block to a Project
// =======================
const addBlock = async (req, res) => {
    const { projectId, name } = req.body;
    const userId = req.user.id;

    if (!projectId || !name) {
        return res.status(400).json({ error: 'projectId and name are required' });
    }

    try {
        // Check if user is part of project
        const check = await pool.query(
            'SELECT * FROM project_users WHERE user_id=$1 AND project_id=$2',
            [userId, projectId]
        );

        if (check.rows.length === 0) {
            return res.status(403).json({ error: 'You are not part of this project' });
        }

        // Insert block
        const result = await pool.query(
            'INSERT INTO project_blocks (project_id, name) VALUES ($1, $2) RETURNING *',
            [projectId, name]
        );

        res.status(201).json({ message: 'Block added successfully', block: result.rows[0] });
    } catch (err) {
        console.error('ADD BLOCK ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 2️⃣ Add Floor to a Block
// =======================
const addFloor = async (req, res) => {
    const { blockId, name } = req.body;
    const userId = req.user.id;

    if (!blockId || !name) {
        return res.status(400).json({ error: 'blockId and name are required' });
    }

    try {
        // Check if user is part of the project for this block
        const block = await pool.query('SELECT project_id FROM project_blocks WHERE id=$1', [blockId]);
        if (block.rows.length === 0) {
            return res.status(404).json({ error: 'Block not found' });
        }

        const projectId = block.rows[0].project_id;

        const check = await pool.query(
            'SELECT * FROM project_users WHERE user_id=$1 AND project_id=$2',
            [userId, projectId]
        );

        if (check.rows.length === 0) {
            return res.status(403).json({ error: 'You are not part of this project' });
        }

        // Insert floor
        const result = await pool.query(
            'INSERT INTO project_floors (block_id, name) VALUES ($1, $2) RETURNING *',
            [blockId, name]
        );

        res.status(201).json({ message: 'Floor added successfully', floor: result.rows[0] });
    } catch (err) {
        console.error('ADD FLOOR ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 3️⃣ List Blocks & Floors for a Project
// =======================
const listProjectStructure = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    try {
        // Check user in project
        const check = await pool.query(
            'SELECT * FROM project_users WHERE user_id=$1 AND project_id=$2',
            [userId, projectId]
        );
        if (check.rows.length === 0) {
            return res.status(403).json({ error: 'You are not part of this project' });
        }

        // Get blocks
        const blocks = await pool.query('SELECT * FROM project_blocks WHERE project_id=$1', [projectId]);

        // For each block, get floors
        const structure = [];
        for (let b of blocks.rows) {
            const floors = await pool.query('SELECT * FROM project_floors WHERE block_id=$1', [b.id]);
            structure.push({
                block: b,
                floors: floors.rows
            });
        }

        res.json({ projectStructure: structure });
    } catch (err) {
        console.error('LIST PROJECT STRUCTURE ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addBlock,
    addFloor,
    listProjectStructure
};
