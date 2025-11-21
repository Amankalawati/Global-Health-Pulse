import React, {useEffect, useState} from 'react'
import { getBloodStock } from '../../api/healthApi'

export default function StockView(){
  const [stock, setStock] = useState([])
  useEffect(()=>{ getBloodStock().then(setStock).catch(()=>{}); },[])
  return (
    <div className="bg-white p-4 rounded border">
      <h3 className="font-semibold">Blood Stock — Centers</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full table-auto text-sm border-collapse">
          <thead>
            <tr className="text-left"><th className="p-2 border-b">Center</th><th className="p-2 border-b">Blood Group</th><th className="p-2 border-b">Units</th><th className="p-2 border-b">City</th><th className="p-2 border-b">Contact</th></tr>
          </thead>
          <tbody>
            {stock.length===0 && <tr><td colSpan={5} className="p-3 text-gray-500">No data</td></tr>}
            {stock.map((s,i)=> (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border-t">{s.center}</td>
                <td className="p-2 border-t">{s.bloodGroup}</td>
                <td className="p-2 border-t">{s.units}</td>
                <td className="p-2 border-t">{s.city}</td>
                <td className="p-2 border-t">{s.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
