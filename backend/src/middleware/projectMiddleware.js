// middleware/projectMiddleware.js
const pool = require('../db');

// Example: check if user is part of project
const isProjectMember = async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    try {
        const result = await pool.query(
            `SELECT * FROM project_users WHERE user_id=$1 AND project_id=$2`,
            [userId, projectId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'You are not a member of this project' });
        }

        req.projectRole = result.rows[0].role; // useful later
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { isProjectMember };
