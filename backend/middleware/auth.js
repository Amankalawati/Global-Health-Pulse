const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-ghp-please-change';
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

async function verifyToken(req, res, next){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    // attach user to request
    const users = await readUsers();
    const user = users.find(u => u.id === payload.sub);
    if(!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken };
