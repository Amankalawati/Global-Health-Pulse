import React, {useState} from 'react'
import { registerDonor } from '../../api/healthApi'

export default function DonorRegister(){
  const [form, setForm] = useState({name:'',contact:'',bloodGroup:'',city:'',lastDonation:''})
  const [msg, setMsg] = useState(null)
  function update(k,v){ setForm(prev=>({...prev,[k]:v})) }
  async function submit(e){
    e.preventDefault();
    try{
      await registerDonor(form);
      setMsg({type:'success',text:'Thank you — your registration has been submitted.'})
      setForm({name:'',contact:'',bloodGroup:'',city:'',lastDonation:''})
    }catch(e){ setMsg({type:'error',text:'Submission failed — try again later.'}) }
  }

  return (
    <div className="bg-white p-6 rounded border max-w-xl">
      <h3 className="font-semibold">Register as a Blood Donor</h3>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <div>
          <label className="text-sm">Full name</label>
          <input value={form.name} onChange={e=>update('name',e.target.value)} required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm">Contact (phone or email)</label>
          <input value={form.contact} onChange={e=>update('contact',e.target.value)} required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm">Blood group</label>
            <select value={form.bloodGroup} onChange={e=>update('bloodGroup',e.target.value)} required className="w-full mt-1 p-2 border rounded">
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <div>
            <label className="text-sm">City</label>
            <input value={form.city} onChange={e=>update('city',e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="text-sm">Last donation date (optional)</label>
          <input type="date" value={form.lastDonation} onChange={e=>update('lastDonation',e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div className="pt-2 flex gap-2">
          <button className="px-4 py-2 bg-ghp-5 text-white rounded font-semibold">Submit</button>
          <button type="button" onClick={()=>setForm({name:'',contact:'',bloodGroup:'',city:'',lastDonation:''})} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </form>
      {msg && <div className={`mt-3 text-sm ${msg.type==='success'?'text-green-700':'text-red-700'}`}>{msg.text}</div>}
    </div>
  )
}
