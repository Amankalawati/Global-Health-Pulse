import React, { createContext, useState, useEffect, useContext } from 'react'
import { setToken as setClientToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('ghp_user')
      const token = localStorage.getItem('ghp_token')
      if(raw) setUser(JSON.parse(raw))
      if(token) setClientToken(token)
    }catch(e){}
    setLoading(false)
  },[])

  const login = ({ user, token }) => {
    try{ localStorage.setItem('ghp_user', JSON.stringify(user)); localStorage.setItem('ghp_token', token); }catch(e){}
    setClientToken(token)
    setUser(user)
  }

  const logout = () => {
    try{ localStorage.removeItem('ghp_user'); localStorage.removeItem('ghp_token'); }catch(e){}
    setClientToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

export default AuthContext
