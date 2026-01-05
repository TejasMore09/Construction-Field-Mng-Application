const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/roleMiddleware');

const {
    createProject,
    getUserProjects,
    addUserToProject,
    removeUserFromProject,
    listProjectMembers,
    updateProject
} = require('../controllers/projectController');

// =======================
// 1️⃣ Create Project → owner only
// =======================
router.post(
    '/projects',
    authMiddleware,
    allowedRoles('owner'),
    createProject
);

// =======================
// 2️⃣ Get all projects of logged-in user → any role
// =======================
router.get(
    '/projects',
    authMiddleware,
    getUserProjects
);

// =======================
// 3️⃣ Add User to Project → manager/owner only
// =======================
router.post(
    '/projects/add-user',
    authMiddleware,
    allowedRoles('manager', 'owner'),
    addUserToProject
);

// =======================
// 4️⃣ Remove User from Project → manager/owner only
// =======================
router.post(
    '/projects/remove-user',
    authMiddleware,
    allowedRoles('manager', 'owner'),
    removeUserFromProject
);

// =======================
// 5️⃣ List Project Members → any member can see
// =======================
router.get(
    '/projects/:projectId/members',
    authMiddleware,
    listProjectMembers
);

// =======================
// 6️⃣ Update Project Info → manager/owner only
// =======================
router.put(
    '/projects/update',
    authMiddleware,
    allowedRoles('manager', 'owner'),
    updateProject
);

module.exports = router;
