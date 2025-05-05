const fs = require('fs').promises;
const path = require('path');

// In-memory locks to serialize writes per file
const writeLocks = {};

async function loadJson(fileName) {
  const filePath = path.join(__dirname, '../../data', fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content || '[]');
}

async function writeJson(fileName, data) {
  const filePath = path.join(__dirname, '../../data', fileName);

  // simple lock
  while (writeLocks[fileName]) {
    await new Promise(r => setTimeout(r, 10));
  }
  writeLocks[fileName] = true;

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  writeLocks[fileName] = false;
}

module.exports = { loadJson, writeJson };
