import React from 'react'
import { Link } from 'react-router-dom'

export default function Prevention() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-20">
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Prevention Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Your complete 2025 guide to stopping outbreaks before they start — backed by WHO, CDC & real-time global health data
          </p>
          <div className="mt-8 flex justify-center">
            <span className="inline-block px-6 py-3 bg-green-100 text-green-800 font-bold rounded-full text-lg">
              Updated November 2025
            </span>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { title: "Hand Hygiene", desc: "20-second wash technique", color: "from-blue-500 to-blue-600" },
            { title: "Mask Guide", desc: "N95 vs KN95 vs surgical", color: "from-indigo-500 to-indigo-600" },
            { title: "2025 Vaccines", desc: "COVID, Flu, RSV, Measles", color: "from-purple-500 to-purple-600" },
            { title: "Safe Travel", desc: "Pre-travel checklist", color: "from-green-500 to-emerald-600" },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.color} text-white p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-between h-full`}>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base opacity-90 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Respiratory Diseases Prevention */}
        <section className="bg-white rounded-3xl shadow-2xl p-10 mb-16 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 flex items-center gap-4">
            <span className="text-5xl">Lungs</span> Respiratory Disease Prevention (2025 Focus)
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-4 border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4">COVID-19 & Flu</h3>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                <li>Get updated 2025–2026 vaccine</li>
                <li>Wear N95/KN95 in crowded places</li>
                <li>Test early — isolate 5+ days if positive</li>
                <li>Ventilate rooms regularly</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-4 border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4">Measles (Rising)</h3>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                <li>2 doses MMR = 97% protection</li>
                <li>Check immunity before travel</li>
                <li>Avoid outbreak countries</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border-4 border-amber-200">
              <h3 className="text-xl font-bold text-amber-800 mb-4">Whooping Cough</h3>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                <li>DTaP/Tdap booster every 10 years</li>
                <li>Pregnant: vaccinate 27–36 weeks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Vector-Borne & Zoonotic */}
        <section className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-3xl shadow-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold mb-10 flex items-center gap-4">
            <span className="text-6xl">Mosquito</span> Mosquito & Animal-Borne Threats
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-5">Dengue, Malaria, Zika</h3>
              <ul className="space-y-4 text-lg">
                <li>Use 30%+ DEET repellent</li>
                <li>Wear long sleeves at dawn/dusk</li>
                <li>Remove standing water</li>
                <li>Sleep under treated nets</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-5 text-yellow-300">Bird Flu H5N1 (2025 Alert)</h3>
              <ul className="space-y-4 text-lg">
                <li>Avoid raw milk & undercooked poultry</li>
                <li>Farm workers: wear full PPE</li>
                <li>Report sick birds immediately</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Daily Prevention Checklist */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Your Daily Prevention Checklist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Wash hands 20+ seconds",
              "Carry hand sanitizer (70%+)",
              "Cover coughs & sneezes",
              "Stay home when sick",
              "Clean phone & surfaces",
              "Stay up-to-date on vaccines",
              "Eat well & exercise",
              "Sleep 7–9 hours"
            ].map((tip, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl text-center hover:bg-white/30 transition">
                <div className="text-4xl mb-3">Checkmark</div>
                <p className="text-sm md:text-base font-semibold leading-tight px-2">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Downloadable Resources - FIXED LINK */}
        <section className="text-center py-16 bg-gray-50 rounded-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Download Official Guides</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public" target="_blank" rel="noreferrer"
               className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-3xl font-bold text-lg shadow-2xl transform hover:scale-105 transition">
              WHO Prevention Guide
            </a>
            <a href="https://www.cdc.gov/vaccines/schedules/downloads/adult/adult-combined-schedule.pdf" target="_blank" rel="noreferrer"
               className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 rounded-3xl font-bold text-lg shadow-2xl transform hover:scale-105 transition">
              CDC Vaccine Schedule
            </a>
            <a href="https://wwwnc.cdc.gov/travel/" target="_blank" rel="noreferrer"
               className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 rounded-3xl font-bold text-lg shadow-2xl transform hover:scale-105 transition">
              CDC Travel Health Guide
            </a>
          </div>
          <p className="mt-6 text-gray-600 text-sm">
            All links open in new tabs to official sources.
          </p>
        </section>

        {/* Final Message */}
        <div className="text-center mt-20 py-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Prevention Works</h2>
          <p className="text-2xl max-w-4xl mx-auto px-6">
            One vaccine, one mask, one handwash at a time — we stop outbreaks together.
          </p>
        </div>

        <footer className="text-center mt-20 text-gray-600 text-lg">
          <p><strong>Global Health Pulse</strong> • Prevention First • 2025</p>
        </footer>
      </main>
    </div>
  )
}