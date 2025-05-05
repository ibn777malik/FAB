const express = require('express');
const {
  listRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/rolesController');

const router = express.Router();
router.get('/',    listRoles);
router.post('/',   createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
