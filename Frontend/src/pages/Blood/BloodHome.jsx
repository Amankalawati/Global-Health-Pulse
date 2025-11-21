import React from 'react'
import { Link } from 'react-router-dom'

export default function BloodHome(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded border">
        <h3 className="font-semibold">Blood Services Overview</h3>
        <p className="text-sm text-gray-700 mt-3">Find donors, register to donate, view stock levels, or raise an emergency request.</p>
        <div className="mt-4 flex gap-3">
          <Link to="register" className="px-4 py-2 bg-ghp-5 text-white rounded font-semibold">Register as Donor</Link>
          <Link to="request" className="px-4 py-2 border border-ghp-5 text-ghp-5 rounded font-semibold">Request Blood</Link>
        </div>
      </div>

      <aside className="bg-white p-6 rounded border">
        <h4 className="font-semibold">Urgent Help</h4>
        <p className="text-sm text-gray-600 mt-2">If it's an emergency call your local health authority or hospital. This portal is informational.</p>
      </aside>
    </div>
  )
}
