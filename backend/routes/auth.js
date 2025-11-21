const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// For development only; in production use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-ghp-please-change';

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

async function readUsers(){
  try{
    const txt = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  }catch(err){
    if(err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users){
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

router.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const users = await readUsers();
    if(users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name: name || '', email, password: hashed, createdAt: new Date().toISOString() };
    users.push(user);
    await writeUsers(users);

    // issue a simple JWT
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, token });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const users = await readUsers();
    const user = users.find(u => u.email === email);
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, token });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
