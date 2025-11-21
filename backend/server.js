const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const { verifyToken } = require('./middleware/auth');
const bloodRouter = require('./routes/blood');
const externalRouter = require('./routes/external');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 4000;
const net = require('net');

async function findAvailablePort(start){
  let port = start;
  for(let i=0;i<10;i++){
    const isFree = await new Promise((resolve)=>{
      const tester = net.createServer()
      tester.once('error', ()=>{ resolve(false) })
      tester.once('listening', ()=>{ tester.close(()=>resolve(true)) })
      tester.listen(port, '0.0.0.0')
    })
    if(isFree) return port
    port++
  }
  return start
}

// Allow requests from the frontend dev server (Vite default)
app.use(cors({ origin: 'http://localhost:5175' }));
app.use(express.json());

app.use('/api', authRouter);

// Protected demo endpoint: returns user info when JWT is valid
app.get('/api/me', verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});
app.use('/api/blood', bloodRouter);
app.use('/api/external', externalRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'GHP backend is running' });
});

;(async ()=>{
  const port = await findAvailablePort(DEFAULT_PORT)
  app.listen(port, () => {
    console.log(`GHP backend listening on http://localhost:${port}`);
  });
})()
