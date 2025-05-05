const { loadJson, writeJson } = require('../dao/jsonDao');
const { v4: uuid } = require('uuid');

// GET /api/properties
async function listProperties(req, res) {
  const props = await loadJson('properties.json');
  res.json(props);
}

// GET /api/properties/:id
async function getProperty(req, res) {
  const props = await loadJson('properties.json');
  const prop = props.find(p => p.id === req.params.id);
  if (!prop) return res.status(404).json({ message: 'Property not found.' });
  res.json(prop);
}

// POST /api/properties
async function createProperty(req, res) {
  const { title, description, price, status, agentId, images } = req.body;
  if (!title || !price || !status) {
    return res.status(400).json({ message: 'Title, price & status are required.' });
  }
  const props = await loadJson('properties.json');
  const newProp = {
    id: uuid(),
    title,
    description: description || '',
    price,
    status,        // e.g. 'available'
    agentId: agentId || null,
    images: Array.isArray(images) ? images : [],
    createdAt: new Date().toISOString()
  };
  props.push(newProp);
  await writeJson('properties.json', props);
  res.status(201).json(newProp);
}

// PUT /api/properties/:id
async function updateProperty(req, res) {
  const updates = req.body;
  const props = await loadJson('properties.json');
  const idx = props.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Property not found.' });
  props[idx] = { ...props[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson('properties.json', props);
  res.json(props[idx]);
}

// DELETE /api/properties/:id
async function deleteProperty(req, res) {
  let props = await loadJson('properties.json');
  if (!props.some(p => p.id === req.params.id)) {
    return res.status(404).json({ message: 'Property not found.' });
  }
  props = props.filter(p => p.id !== req.params.id);
  await writeJson('properties.json', props);
  res.status(204).end();
}

module.exports = {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
};
