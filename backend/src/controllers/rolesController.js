const { loadJson, writeJson } = require('../dao/jsonDao');
const { v4: uuid } = require('uuid');

// GET /api/roles
async function listRoles(req, res) {
  const roles = await loadJson('roles.json');
  res.json(roles);
}

// POST /api/roles
async function createRole(req, res) {
  const { name, permissions } = req.body;
  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ message: 'Name and permissions array required.' });
  }
  const roles = await loadJson('roles.json');
  const newRole = { id: uuid(), name, permissions };
  roles.push(newRole);
  await writeJson('roles.json', roles);
  res.status(201).json(newRole);
}

// PUT /api/roles/:id
async function updateRole(req, res) {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const roles = await loadJson('roles.json');
  const idx = roles.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Role not found.' });
  roles[idx] = { ...roles[idx], name, permissions };
  await writeJson('roles.json', roles);
  res.json(roles[idx]);
}

// DELETE /api/roles/:id
async function deleteRole(req, res) {
  const { id } = req.params;
  let roles = await loadJson('roles.json');
  if (!roles.some(r => r.id === id)) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  roles = roles.filter(r => r.id !== id);
  await writeJson('roles.json', roles);
  res.status(204).end();
}

module.exports = { listRoles, createRole, updateRole, deleteRole };
