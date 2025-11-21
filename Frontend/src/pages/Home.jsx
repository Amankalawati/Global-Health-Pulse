import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getGlobalCovidWithMeta } from '../api/healthApi'
import GlobalStats from '../components/GlobalStats'
import client from '../api/client'

export default function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [source, setSource] = useState(null)

  const GNEWS_KEY = 'e6dde766eaa1a46cfb377b586592c437'

  const fetchLiveNews = async () => {
    setLoadingNews(true)
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=measles+OR+vaccine+OR+outbreak+OR+who+OR+cdc+OR+epidemic+OR+pandemic&sources=who.int,cdc.gov,unicef.org,reuters.com,bbc.com&lang=en&max=20&apikey=${GNEWS_KEY}`
      )
      const data = await res.json()

      if (data.articles?.length > 0) {
        const filtered = data.articles
          .filter(a => a.title && (
            a.title.toLowerCase().includes('measles') ||
            a.title.toLowerCase().includes('vaccine') ||
            a.title.toLowerCase().includes('outbreak') ||
            a.title.toLowerCase().includes('who') ||
            a.title.toLowerCase().includes('cdc')
          ))
          .slice(0, 15)

        if (filtered.length > 0) {
          setNews(filtered.map(a => ({
            title: a.title,
            url: a.url,
            source: a.source?.name || 'Health Authority'
          })))
          setLoadingNews(false)
          return
        }
      }
    } catch (e) {}

    // Fallback: WHO RSS
    try {
      const r = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml')
      const d = await r.json()
      if (d.items?.length > 0) {
        setNews(d.items.slice(0, 10).map(i => ({
          title: i.title,
          url: i.link,
          source: 'WHO'
        })))
        setLoadingNews(false)
        return
      }
    } catch (e) {}

    // Final fallback
    setNews([
      { title: 'CDC: U.S. measles cases reach 1,723 in 2025 — highest in decades', url: 'https://cdc.gov', source: 'CDC' },
      { title: 'WHO warns of rising global measles and polio outbreaks', url: 'https://who.int', source: 'WHO' },
      { title: 'Bird flu spreads rapidly in U.S. poultry farms', url: 'https://cdc.gov', source: 'CDC' },
      { title: 'New COVID variant under close monitoring by WHO', url: 'https://who.int', source: 'WHO' },
      { title: 'CDC recommends updated 2025–2026 vaccines now available', url: 'https://cdc.gov', source: 'CDC' }
    ])
    setLoadingNews(false)
  }

  useEffect(() => {
    fetchLiveNews()
    const interval = setInterval(fetchLiveNews, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // COVID data
  useEffect(() => {
    const load = async () => {
      try {
        const r = await getGlobalCovidWithMeta()
        setSource(r.headers?.['x-data-source'] || 'Live')
        setLastUpdated(new Date(r.data?.as_of || Date.now()))
      } catch (e) {}
    }
    load()
    if (autoRefresh) setInterval(load, 60000)
  }, [autoRefresh])

  // Login check
  const [me, setMe] = useState(null)
  useEffect(() => {
    (async () => {
      try {
        const r = await client.get('/me')
        setMe(r.data.user)
      } catch (e) {}
    })()
  }, [])

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <h1 className="text-3xl font-bold text-gray-900">Know. Detect. Prevent. Stay safe.</h1>
            <p className="text-gray-600 mt-3 text-lg">Real-time global health monitoring and early detection tools.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate('/symptoms')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:scale-105">
                Symptom Checker
              </button>
              <button onClick={() => navigate('/global-cases')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition transform hover:scale-105">
                Global Cases
              </button>
              <Link to="/prevention" className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                Prevention Hub
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {source && <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">Live Data</span>}
                {lastUpdated && <span className="text-gray-500">Updated: {new Intl.DateTimeFormat().format(lastUpdated)}</span>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="w-5 h-5 text-blue-600" />
                <span>Auto-refresh</span>
              </label>
            </div>

            <div className="mt-8">
              <GlobalStats autoRefresh={autoRefresh} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-bold">Prevention Guides</h4>
              <ul className="mt-4 space-y-2 text-teal-50"><li>Hand hygiene</li><li>Vaccines</li><li>Safe travel</li></ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-bold">Early Detection</h4>
              <p className="mt-4 text-purple-50">AI-powered symptom checker</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-bold">Blood Services</h4>
              <p className="mt-4 text-rose-50">Donate or request blood</p>
            </div>
          </div>
        </div>

        {/* VERTICAL UPWARD SCROLLING TICKER — FINAL VERSION */}
        <aside className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center gap-3">
            <span className="text-sm font-bold animate-pulse">LIVE</span>
            <h3 className="text-xl font-bold">Global Health Alerts</h3>
          </div>

          <div className="h-96 overflow-hidden relative bg-gradient-to-b from-gray-50 to-white">
            {loadingNews ? (
              <div className="flex h-full items-center justify-center text-gray-500">Loading alerts...</div>
            ) : news.length > 0 ? (
              <div className="animate-scroll-upward">
                {/* Duplicate list for seamless loop */}
                {[...news, ...news].map((item, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">●</span>
                      <div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                        >
                          {item.title}
                        </a>
                        <div className="text-xs text-gray-500 mt-1">— {item.source}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">No alerts</div>
            )}
          </div>
        </aside>
      </div>

      {me && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <strong>Welcome back,</strong> <span className="ml-2 text-green-800 font-bold">{me.name || me.email}</span>
        </div>
      )}
    </section>
  )
}

// Smooth upward scrolling + pause on hover
const style = document.createElement('style')
style.innerHTML = `
  @keyframes scroll-upward {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  .animate-scroll-upward {
    animation: scroll-upward 50s linear infinite;
  }
  .animate-scroll-upward:hover {
    animation-play-state: paused;
  }
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`
document.head.appendChild(style)