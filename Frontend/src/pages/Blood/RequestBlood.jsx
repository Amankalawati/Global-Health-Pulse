import React, {useState} from 'react'
import { createBloodRequest } from '../../api/healthApi'

export default function RequestBlood(){
  const [form, setForm] = useState({patientName:'',bloodGroup:'',units:1,city:'',hospital:'',contact:''})
  const [msg, setMsg] = useState(null)
  function u(k,v){ setForm(prev=>({...prev,[k]:v})) }
  async function submit(e){
    e.preventDefault();
    try{
      await createBloodRequest(form);
      setMsg({type:'success',text:'Request submitted — health officials will review and contact donors.'})
      setForm({patientName:'',bloodGroup:'',units:1,city:'',hospital:'',contact:''})
    }catch(e){ setMsg({type:'error',text:'Failed to submit — try again later.'}) }
  }

  return (
    <div className="bg-white p-6 rounded border max-w-xl">
      <h3 className="font-semibold">Request Blood</h3>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input value={form.patientName} onChange={e=>u('patientName',e.target.value)} placeholder="Patient name" required className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-2">
          <select value={form.bloodGroup} onChange={e=>u('bloodGroup',e.target.value)} required className="w-full p-2 border rounded">
            <option value="">Select blood group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
          <input type="number" min={1} value={form.units} onChange={e=>u('units',e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <input value={form.city} onChange={e=>u('city',e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
        <input value={form.hospital} onChange={e=>u('hospital',e.target.value)} placeholder="Hospital name" className="w-full p-2 border rounded" />
        <input value={form.contact} onChange={e=>u('contact',e.target.value)} placeholder="Contact phone/email" className="w-full p-2 border rounded" />
        <div className="pt-2 flex gap-2">
          <button className="px-4 py-2 bg-ghp-5 text-white rounded font-semibold">Submit Request</button>
        </div>
      </form>
      {msg && <div className={`mt-3 text-sm ${msg.type==='success'?'text-green-700':'text-red-700'}`}>{msg.text}</div>}
    </div>
  )
}
