import React, { useEffect, useState } from 'react'

export default function GlobalStats({ autoRefresh=true }) {
  const [data, setData] = useState({
    cases: 0,
    active: 0,
    deaths: 0,
  })

  const fetchData = async () => {
    try {
      const response = await fetch('https://disease.sh/v3/covid-19/all')
      const result = await response.json()

      setData({
        cases: result.cases,
        active: result.active,
        deaths: result.deaths,
      })
    } catch (error) {
      console.error('API Fetch Error:', error)
    }
  }

  useEffect(() => {
    fetchData()
    let interval = null

    if (autoRefresh) {
      interval = setInterval(fetchData, 20000)
    }

    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      <StatCard title="Global Cases" value={data.cases} />
      <StatCard title="Active" value={data.active} />
      <StatCard title="Deaths" value={data.deaths} />
    </div>
  )
}

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md p-6 rounded-lg text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{(value || 0).toLocaleString()}</p>
  </div>
)
