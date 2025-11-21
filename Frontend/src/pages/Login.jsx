import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiLogin } from '../api/healthApi'
import { setToken } from '../api/client'

export default function Login(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if(!email || !password){
      setError('Please provide both email and password.')
      return
    }
    setLoading(true)
    try{
      const data = await apiLogin({ email, password })
      console.log('Login success', data)
      // delegate to auth context if available
      try{ const { login } = (await import('../context/AuthContext')).useAuth ? (await import('../context/AuthContext')).useAuth() : {} }catch(e){}
      // fallback: set localStorage and axios token
      try{ localStorage.setItem('ghp_user', JSON.stringify(data.user || data)); localStorage.setItem('ghp_token', data.token); setToken(data.token); }catch(e){}
      setLoading(false)
      navigate('/')
    }catch(err){
      console.error(err)
      setError(err?.response?.data?.error || err?.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Email</span>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            className="mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-ghp-3"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Password</span>
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type="password"
            className="mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-ghp-3"
            placeholder="Your password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-ghp-5 text-white px-4 py-2 rounded font-semibold transition transform duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ghp-3/40 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-ghp-5 font-medium">Register</Link>
      </div>
    </div>
  )
}
