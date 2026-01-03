// models/User.js

const pool = require('../db'); // make sure db.js exports pg pool

const Roles = Object.freeze({
  WORKER: 'worker',
  SITE_ENGINEER: 'site_engineer',
  MANAGER: 'manager',
  OWNER: 'owner'
});

const createUser = async ({ name, email, password, role }) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, email, password, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  createUser,
  Roles
};
