import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiRegister } from '../api/healthApi'
import { setToken } from '../api/client'

export default function Register(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if(!name || !email || !password){
      setError('Please fill all fields.')
      return
    }
    if(password !== confirm){
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try{
      const data = await apiRegister({ name, email, password })
      console.log('Register success', data)
      // delegate to auth context if available (best-effort)
      try{ const { login } = (await import('../context/AuthContext')).useAuth ? (await import('../context/AuthContext')).useAuth() : {} }catch(e){}
      try{ localStorage.setItem('ghp_user', JSON.stringify(data.user || data)); localStorage.setItem('ghp_token', data.token); setToken(data.token); }catch(e){}
      setLoading(false)
      navigate('/')
    }catch(err){
      console.error(err)
      setError(err?.response?.data?.error || err?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Full name</span>
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 px-3 py-2 border rounded" placeholder="Your name" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Email</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="mt-1 px-3 py-2 border rounded" placeholder="you@example.com" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Password</span>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="mt-1 px-3 py-2 border rounded" placeholder="Choose a password" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">Confirm Password</span>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" className="mt-1 px-3 py-2 border rounded" placeholder="Confirm password" />
        </label>

        <button disabled={loading} className="mt-2 bg-ghp-5 text-white px-4 py-2 rounded font-semibold transition transform duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ghp-3/40 disabled:opacity-60">{loading ? 'Creating...' : 'Create account'}</button>
      </form>

      <div className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-ghp-5 font-medium">Sign in</Link>
      </div>
    </div>
  )
}
