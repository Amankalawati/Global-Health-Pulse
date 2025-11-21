const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname, '..', 'data')

// Simple in-memory cache to avoid excessive external API calls.
// Keyed by route + optional country (e.g. 'global', 'global:india')
const cache = new Map()
function getCached(key){
  const entry = cache.get(key)
  if(!entry) return null
  if(Date.now() - entry.ts > (entry.ttl||60000)) { cache.delete(key); return null }
  return entry.value
}
function setCached(key, value, ttl=60000){
  cache.set(key, { value, ts: Date.now(), ttl })
}

// If you set API_NINJAS_KEY in backend env, this will proxy requests to api-ninjas
// Otherwise it returns mock data.
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || '';

router.get('/covid/global', async (req, res) => {
  // Allow optional `country` query param. If provided, proxy to API Ninjas with that country.
  // Otherwise attempt to fetch without params (API Ninjas may require country; we'll fallback to mock on error).
  if(!API_NINJAS_KEY){
    // fallback mock from file if present
    try{
      // If country param is provided, try to return a country-level mock from countries file
      if(req.query && req.query.country){
        const countriesPath = path.join(dataDir, 'mock_covid_countries.json')
        if(fs.existsSync(countriesPath)){
          const countries = JSON.parse(fs.readFileSync(countriesPath,'utf8'))
          const q = String(req.query.country).toLowerCase()
          const found = countries.find(c => (c.country && String(c.country).toLowerCase() === q))
          if(found){ res.setHeader('X-Data-Source','mock'); setCached('global:'+q, found); return res.json(found) }
        }
      }
      const globalPath = path.join(dataDir, 'mock_covid_global.json')
      if(fs.existsSync(globalPath)){
        const global = JSON.parse(fs.readFileSync(globalPath,'utf8'))
        res.setHeader('X-Data-Source','mock')
        setCached('global', global)
        return res.json(global)
      }
    }catch(e){ console.error('reading mock global:', e) }

    // final fallback
    const fallback = { cases: 123456789, active: 2345678, deaths: 3456789 }
    res.setHeader('X-Data-Source','mock')
    setCached('global', fallback)
    return res.json(fallback);
  }

  try{
    // check cache first
    const cacheKey = 'global' + (req.query && req.query.country ? ':' + String(req.query.country).toLowerCase() : '')
    const cached = getCached(cacheKey)
    if(cached){ res.setHeader('X-Data-Source','cache'); return res.json(cached) }

    const base = 'https://api.api-ninjas.com/v1/covid19'
    const qs = Object.keys(req.query).length ? ('?' + new URLSearchParams(req.query).toString()) : ''
    const url = base + qs
    const r = await fetch(url, { headers: { 'X-Api-Key': API_NINJAS_KEY } });
    if(!r.ok){
      const txt = await r.text();
      console.error('api-ninjas error', r.status, txt);
      return res.status(502).json({ error: 'External API error', detail: txt });
    }
    const data = await r.json();
    res.setHeader('X-Data-Source','api-ninjas')
    // cache the result for 60s
    setCached(cacheKey, data, 60000)
    return res.json(data);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/covid/countries', async (req, res) => {
  if(!API_NINJAS_KEY){
    try{
      const countriesPath = path.join(dataDir, 'mock_covid_countries.json')
      if(fs.existsSync(countriesPath)){
        const countries = JSON.parse(fs.readFileSync(countriesPath,'utf8'))
        res.setHeader('X-Data-Source','mock')
        return res.json(countries)
      }
    }catch(e){ console.error('reading mock countries:', e) }

    return res.json([
      { country: 'Country A', cases: 100000, deaths: 2000 },
      { country: 'Country B', cases: 50000, deaths: 700 }
    ]);
  }

  try{
    // If API_NINJAS_KEY is set, forward any query params to the API and return the response.
    if(Object.keys(req.query).length){
      // cache key for countries list queries
      const cacheKey = 'countries' + (req.query.country ? ':' + String(req.query.country).toLowerCase() : '')
      const cached = getCached(cacheKey)
      if(cached){ res.setHeader('X-Data-Source','cache'); return res.json(cached) }

      const base = 'https://api.api-ninjas.com/v1/covid19'
      const qs = '?' + new URLSearchParams(req.query).toString()
      const url = base + qs
      const r = await fetch(url, { headers: { 'X-Api-Key': API_NINJAS_KEY } });
      if(!r.ok){
        const txt = await r.text();
        console.error('api-ninjas error', r.status, txt);
        return res.status(502).json({ error: 'External API error', detail: txt });
      }
      const data = await r.json();
      res.setHeader('X-Data-Source','api-ninjas')
      setCached(cacheKey, data, 60000)
      return res.json(data);
    }

    // fallback mock response when no country param is provided
    res.setHeader('X-Data-Source','mock')
    return res.json([
      { country: 'Country A', cases: 100000, deaths: 2000 },
      { country: 'Country B', cases: 50000, deaths: 700 }
    ]);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
