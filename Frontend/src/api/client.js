import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const client = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } })

// attach token if present
client.interceptors.request.use(cfg => {
  try{
    const raw = localStorage.getItem('ghp_token')
    if(raw) cfg.headers.Authorization = `Bearer ${raw}`
  }catch(e){}
  return cfg
})

export function setToken(token){
  try{ if(token) localStorage.setItem('ghp_token', token); else localStorage.removeItem('ghp_token') }catch(e){}
  // update default header for current axios instance
  if(token) client.defaults.headers.Authorization = `Bearer ${token}`
  else delete client.defaults.headers.Authorization
}

export default client
