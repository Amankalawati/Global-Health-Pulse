import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import BloodHome from './BloodHome'
import DonorRegister from './DonorRegister'
import RequestBlood from './RequestBlood'
import StockView from './StockView'

export default function Blood(){
  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <h2 className="text-xl font-semibold">Blood Donation & Requests</h2>
        <nav className="ml-auto flex gap-3">
          <Link to=".">Overview</Link>
          <Link to="register">Register as Donor</Link>
          <Link to="request">Request Blood</Link>
          <Link to="stock">Stock</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<BloodHome/>} />
        <Route path="register" element={<DonorRegister/>} />
        <Route path="request" element={<RequestBlood/>} />
        <Route path="stock" element={<StockView/>} />
      </Routes>
    </div>
  )
}
