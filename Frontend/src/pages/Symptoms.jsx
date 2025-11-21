import React, { useState } from 'react'
import Header from '../components/Header'

export default function Symptoms() {
  // === State ===
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    breath: false,
    fatigue: false,
    taste: false,
    headache: false,
    soreThroat: false,
    bodyAche: false,
  })

  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // === Full Symptom List ===
  const symptomList = [
    { id: 'fever', label: 'Fever or chills' },
    { id: 'cough', label: 'Persistent cough' },
    { id: 'breath', label: 'Shortness of breath or difficulty breathing' },
    { id: 'fatigue', label: 'Extreme fatigue' },
    { id: 'taste', label: 'Loss of taste or smell' },
    { id: 'headache', label: 'Severe headache' },
    { id: 'soreThroat', label: 'Sore throat' },
    { id: 'bodyAche', label: 'Muscle or body aches' },
  ]

  // === Core Risk Evaluation Function ===
  const evaluateRisk = () => {
    const selected = Object.values(symptoms).filter(Boolean).length
    const hasCritical = symptoms.taste || symptoms.breath || symptoms.fever
    const hasMultiple = selected >= 3

    let riskLevel = 'low'
    let message = ''
    let color = 'green'

    if (symptoms.breath) {
      riskLevel = 'emergency'
      message = 'EMERGENCY: Difficulty breathing is a serious symptom. Call emergency services (e.g., 911, 108, 112) immediately.'
      color = 'red'
    } else if (hasCritical && selected >= 2) {
      riskLevel = 'high'
      message = 'HIGH RISK: Your symptoms strongly suggest possible COVID-19 or serious infection. Get tested immediately and self-isolate.'
      color = 'red'
    } else if (hasMultiple || (symptoms.taste && selected >= 1)) {
      riskLevel = 'high'
      message = 'HIGH RISK: Loss of taste/smell or multiple symptoms detected. Seek testing and medical advice urgently.'
      color = 'red'
    } else if (selected >= 2) {
      riskLevel = 'medium'
      message = 'MODERATE RISK: You have several symptoms. Self-isolate, monitor closely, and contact a doctor if symptoms worsen.'
      color = 'yellow'
    } else if (selected === 1) {
      riskLevel = 'low'
      message = 'LOW RISK: One mild symptom. Rest, hydrate, and monitor. Isolate if new symptoms appear.'
      color = 'blue'
    } else {
      riskLevel = 'none'
      message = 'No symptoms reported. Excellent! Continue wearing a mask, washing hands, and staying vigilant.'
      color = 'green'
    }

    setResult({ riskLevel, message, color, selected })
    setShowResult(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // === Reset Everything ===
  const resetChecker = () => {
    setSymptoms({
      fever: false, cough: false, breath: false, fatigue: false,
      taste: false, headache: false, soreThroat: false, bodyAche: false,
    })
    setResult(null)
    setShowResult(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            COVID-19 Symptom Checker
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Quick self-assessment based on WHO & CDC guidelines. Not a medical diagnosis.
          </p>
        </div>

        {/* Result Banner */}
        {showResult && result && (
          <div className={`mb-10 p-8 rounded-3xl shadow-2xl border-l-8 text-white font-medium transition-all ${
            result.color === 'red' ? 'bg-red-600 border-red-800' :
            result.color === 'yellow' ? 'bg-yellow-500 border-yellow-700' :
            result.color === 'blue' ? 'bg-blue-600 border-blue-800' :
            'bg-green-600 border-green-800'
          }`}>
            <h2 className="text-2xl md:text-3xl font-bold">Your Risk Assessment</h2>
            <p className="mt-3 text-lg">Symptoms selected: <strong>{result.selected}</strong></p>
            <div className="mt-5 text-xl leading-relaxed">{result.message}</div>
            <button
              onClick={resetChecker}
              className="mt-8 bg-white text-gray-800 font-bold px-8 py-4 rounded-full hover:scale-105 transition shadow-lg"
            >
              Check Again
            </button>
          </div>
        )}

        {/* Symptom Selection Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Select all symptoms you have right now
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {symptomList.map(symptom => (
              <label
                key={symptom.id}
                className="flex items-center gap-5 p-6 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <input
                  type="checkbox"
                  checked={symptoms[symptom.id]}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, [symptom.id]: e.target.checked }))}
                  className="w-7 h-7 text-blue-600 rounded focus:ring-4 focus:ring-blue-200"
                />
                <span className="text-lg font-medium text-gray-800 group-hover:text-blue-700">
                  {symptom.label}
                </span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={evaluateRisk}
              className="flex-1 bg-blue-700 text-white font-bold text-xl py-6 rounded-2xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Evaluate My Risk
            </button>
            <button
              onClick={resetChecker}
              className="px-10 py-6 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition"
            >
              Reset All
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl">
            <p className="text-amber-800 font-medium text-center">
              This tool is for informational purposes only. Always consult a healthcare professional or get tested for accurate diagnosis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>Global Health Pulse • Powered by Real-time Health Intelligence • 2025</p>
        </div>
      </main>
    </div>
  )
}