// controllers/projectController.js
const pool = require('../db');

// =======================
// 1️⃣ Create Project
// =======================
const createProject = async (req, res) => {
    const { name, location } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    try {
        const projectResult = await pool.query(
            `INSERT INTO projects (name, location, created_by)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, location || '', userId]
        );

        const project = projectResult.rows[0];

        // Auto-add creator as owner
        await pool.query(
            `INSERT INTO project_users (user_id, project_id, role)
             VALUES ($1, $2, 'owner')`,
            [userId, project.id]
        );

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
        console.error('CREATE PROJECT ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 2️⃣ Get Projects of Logged-in User
// =======================
const getUserProjects = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT p.*
             FROM projects p
             JOIN project_users pu ON p.id = pu.project_id
             WHERE pu.user_id = $1`,
            [userId]
        );

        res.json({ projects: result.rows });
    } catch (err) {
        console.error('GET PROJECTS ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 3️⃣ Add User to Project (manager/owner only)
// =======================
const addUserToProject = async (req, res) => {
    const { projectId, userId, role } = req.body;
    const requesterId = req.user.id;
    const allowedRoles = ['manager', 'owner'];

    if (!projectId || !userId || !role) {
        return res.status(400).json({ error: 'projectId, userId, and role are required' });
    }

    try {
        // Check requester role in project
        const requester = await pool.query(
            'SELECT role FROM project_users WHERE user_id=$1 AND project_id=$2',
            [requesterId, projectId]
        );

        if (requester.rows.length === 0 || !allowedRoles.includes(requester.rows[0].role)) {
            return res.status(403).json({ error: 'You do not have permission to add users to this project' });
        }

        // Check if user already exists in project
        const existing = await pool.query(
            'SELECT * FROM project_users WHERE user_id=$1 AND project_id=$2',
            [userId, projectId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User is already part of the project' });
        }

        // Add user
        await pool.query(
            'INSERT INTO project_users (user_id, project_id, role) VALUES ($1, $2, $3)',
            [userId, projectId, role]
        );

        res.status(201).json({ message: 'User added to project successfully' });
    } catch (err) {
        console.error('ADD USER TO PROJECT ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 4️⃣ Remove User from Project (manager/owner only)
// =======================
const removeUserFromProject = async (req, res) => {
    const { projectId, userId } = req.body;
    const requesterId = req.user.id;
    const allowedRoles = ['manager', 'owner'];

    try {
        const requester = await pool.query(
            'SELECT role FROM project_users WHERE user_id=$1 AND project_id=$2',
            [requesterId, projectId]
        );

        if (requester.rows.length === 0 || !allowedRoles.includes(requester.rows[0].role)) {
            return res.status(403).json({ error: 'You do not have permission to remove users from this project' });
        }

        await pool.query(
            'DELETE FROM project_users WHERE user_id=$1 AND project_id=$2',
            [userId, projectId]
        );

        res.json({ message: 'User removed from project successfully' });
    } catch (err) {
        console.error('REMOVE USER ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 5️⃣ List Project Members with Roles
// =======================
const listProjectMembers = async (req, res) => {
    const { projectId } = req.params;

    try {
        const members = await pool.query(
            `SELECT u.id, u.name, u.email, pu.role
             FROM users u
             JOIN project_users pu ON u.id = pu.user_id
             WHERE pu.project_id = $1`,
            [projectId]
        );

        res.json({ members: members.rows });
    } catch (err) {
        console.error('LIST MEMBERS ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// =======================
// 6️⃣ Update Project Info (owner/manager only)
// =======================
const updateProject = async (req, res) => {
    const { projectId, name, location } = req.body;
    const requesterId = req.user.id;
    const allowedRoles = ['manager', 'owner'];

    try {
        const requester = await pool.query(
            'SELECT role FROM project_users WHERE user_id=$1 AND project_id=$2',
            [requesterId, projectId]
        );

        if (requester.rows.length === 0 || !allowedRoles.includes(requester.rows[0].role)) {
            return res.status(403).json({ error: 'You do not have permission to update this project' });
        }

        const updated = await pool.query(
            'UPDATE projects SET name=$1, location=$2 WHERE id=$3 RETURNING *',
            [name, location, projectId]
        );

        res.json({ message: 'Project updated successfully', project: updated.rows[0] });
    } catch (err) {
        console.error('UPDATE PROJECT ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createProject,
    getUserProjects,
    addUserToProject,
    removeUserFromProject,
    listProjectMembers,
    updateProject
};
