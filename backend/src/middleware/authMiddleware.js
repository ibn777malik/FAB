const jwt = require('jsonwebtoken');
const { loadJson } = require('../dao/jsonDao');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const settings = await loadJson('settings.json');
    const payload = jwt.verify(token, settings.jwtSecret);
    // attach user info to request
    req.user = { id: payload.userId, roleId: payload.roleId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
