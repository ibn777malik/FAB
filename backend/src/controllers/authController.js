const { loadJson, writeJson } = require('../dao/jsonDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

// POST /auth/register
async function register(req, res) {
  const { email, password, roleId } = req.body;
  if (!email || !password || !roleId) {
    return res.status(400).json({ message: 'Email, password & roleId are required.' });
  }

  // load existing users
  const users = await loadJson('users.json');

  // check for duplicate email
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // create new user
  const newUser = {
    id: uuid(),
    email,
    passwordHash,
    roleId,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  // persist
  await writeJson('users.json', users);

  // respond (omit hash)
  return res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    roleId: newUser.roleId,
    createdAt: newUser.createdAt
  });
}

// POST /auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email & password are required.' });
  }

  // load users
  const users = await loadJson('users.json');
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  // verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  // load JWT settings
  const settings = await loadJson('settings.json');
  const token = jwt.sign(
    { userId: user.id, roleId: user.roleId },
    settings.jwtSecret,
    { expiresIn: settings.tokenExpiry }
  );

  return res.json({ token });
}

module.exports = { register, login };
