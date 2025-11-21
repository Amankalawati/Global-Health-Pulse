import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../api/client'
import { useAuth } from '../context/AuthContext'
import embolem from '../assets/embolem.png';
import headerWebp from '../assets/header.webp';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth()
  const navigate = useNavigate();
  
  // ensure axios client uses saved token on header (in case provider didn't set)
  useEffect(()=>{
    try{ const saved = localStorage.getItem('ghp_token'); if(saved) setToken(saved); }
    catch(e){}
  },[])

  const NavLinks = ({ onClick }) => (
    <>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/"
      >
        Home
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/issues"
      >
        Issues
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/prevention"
      >
        Prevention
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/tools"
      >
        Tools
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/blood"
      >
        Blood
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded text-white/95 hover:text-white hover:bg-white/10 transition transform duration-200 ease-in-out hover:scale-105"
        to="/login"
      >
        Login
      </Link>
      <Link
        onClick={onClick}
        className="px-3 py-1 rounded bg-white/10 text-white/95 hover:bg-white/20 transition transform duration-200 ease-in-out hover:scale-105"
        to="/register"
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden" style={{ minHeight: 320 }}>
      {/* Background image */}
      <img
        src={headerWebp}
        alt="Header background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.7)' }}
      />
      {/* Overlay content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between h-full">
        <div className="flex flex-col gap-4 max-w-lg py-8">
          <div className="flex items-center gap-3">
            <img
              src={embolem}
              alt="Global Health Pulse emblem"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-white/30 bg-white/10 object-cover shadow"
            />
            <div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-white drop-shadow">Global Health Pulse</div>
              <div className="text-sm sm:text-base text-white/90">International Health Monitoring Portal</div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow">Monitor, Prevent & Connect</h1>
            <p className="text-white/90 text-base sm:text-lg mb-4">Empowering global health with real-time data, prevention tools, and blood donation support.</p>
            <Link to="/blood">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded shadow transition transform duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105">Blood Bank</button>
            </Link>
          </div>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-row gap-4 text-base font-semibold items-center self-start mt-8">
            <NavLinks />
            {user ? (
              <>
                <div className="px-3 py-1 text-white/90">{user.name || user.email}</div>
                <button onClick={()=>{ logout(); navigate('/'); }} className="px-3 py-1 bg-white/10 rounded text-white hover:bg-white/20 transition">Sign out</button>
              </>
            ) : null}
          </nav>
        {/* Mobile Hamburger */}
        <div className="md:hidden absolute top-6 right-6 z-20">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 flex items-center justify-center focus:outline-none bg-white/20 rounded"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className={`block absolute w-6 h-0.5 bg-white transform transition duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`block absolute w-6 h-0.5 bg-white transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block absolute w-6 h-0.5 bg-white transform transition duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>
      {/* Mobile Menu (animated) */}
      <div
        id="mobile-nav"
        className={`md:hidden absolute top-20 left-0 w-full px-6 pt-2 pb-4 transition-all duration-300 overflow-hidden bg-black/80 ${open ? 'max-h-96' : 'max-h-0'}`}
        aria-hidden={!open}
        style={{ zIndex: 30 }}
      >
        <div className="flex flex-col gap-3 text-base font-semibold text-white">
          <NavLinks onClick={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
