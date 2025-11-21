const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DONORS_FILE = path.join(__dirname, '..', 'data', 'donors.json');
const REQUESTS_FILE = path.join(__dirname, '..', 'data', 'requests.json');
const STOCK_FILE = path.join(__dirname, '..', 'data', 'stock.json');

async function readJson(file){
  try{ const txt = await fs.readFile(file, 'utf8'); return JSON.parse(txt || '[]'); }
  catch(err){ if(err.code==='ENOENT') return []; throw err }
}
async function writeJson(file, data){ await fs.mkdir(path.dirname(file), {recursive:true}); await fs.writeFile(file, JSON.stringify(data,null,2),'utf8'); }

router.post('/donors', async (req, res) => {
  try{
    const payload = req.body;
    const donors = await readJson(DONORS_FILE);
    donors.push({ id: Date.now(), ...payload, createdAt: new Date().toISOString() });
    await writeJson(DONORS_FILE, donors);
    return res.json({ ok: true });
  }catch(err){ console.error(err); return res.status(500).json({ error: 'Server error' }) }
});

router.get('/donors', async (req, res) => {
  const donors = await readJson(DONORS_FILE);
  return res.json(donors);
});

router.get('/stock', async (req, res) => {
  const stock = await readJson(STOCK_FILE);
  return res.json(stock);
});

router.post('/requests', async (req, res) => {
  try{
    const payload = req.body;
    const reqs = await readJson(REQUESTS_FILE);
    reqs.push({ id: Date.now(), ...payload, createdAt: new Date().toISOString() });
    await writeJson(REQUESTS_FILE, reqs);
    return res.json({ ok: true });
  }catch(err){ console.error(err); return res.status(500).json({ error: 'Server error' }) }
});

module.exports = router;
