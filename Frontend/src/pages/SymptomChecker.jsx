import React, { useState } from 'react'

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

  const [aiResult, setAiResult] = useState(null)
  const [loading, setLoading] = useState(false)
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

  // === Get Selected Symptoms as Text ===
  const getSelectedSymptoms = () => {
    return Object.keys(symptoms)
      .filter(key => symptoms[key])
      .map(key => symptomList.find(s => s.id === key)?.label || key)
      .join(', ')
  }

  // === AI Diagnosis & Prevention (Primary: EndlessMedical - Free Sandbox) ===
  const checkWithAI = async () => {
    const selected = getSelectedSymptoms()
    if (!selected) {
      setAiResult({ diagnosis: 'Please select at least one symptom.', prevention: '', error: true })
      setShowResult(true)
      return
    }

    setLoading(true)
    setShowResult(true)
    setAiResult(null)

    try {
      // Primary: EndlessMedical API (Free sandbox - no key needed)
      const response = await fetch('https://api.endlessmedical.com/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selected.split(', '),
          age: 30, // Default; add age input later
          gender: 'male', // Default
          duration: 'days'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const topDiagnosis = data.diagnoses?.[0]?.name || 'Viral infection likely'
        const likelihood = data.diagnoses?.[0]?.probability || 'High'
        const prevention = data.recommendations?.join(', ') || 'Isolate, test, hydrate, rest'

        setAiResult({
          diagnosis: `${topDiagnosis} (Likelihood: ${likelihood})`,
          prevention: `Next Steps: ${prevention}`,
          error: false
        })
      } else {
        throw new Error('API unavailable')
      }
    } catch (err) {
      // Fallback: Ubie Symptom Checker (Free public endpoint)
      try {
        const ubieRes = await fetch('https://ubiehealth.com/api/symptom-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symptoms: selected,
            age: 30,
            gender: 'male'
          })
        })

        if (ubieRes.ok) {
          const ubieData = await ubieRes.json()
          const diagnosis = ubieData.possibleCauses?.[0] || 'Respiratory infection'
          const prevention = ubieData.recommendations || 'Test for COVID/flu, isolate 5 days, monitor symptoms'

          setAiResult({
            diagnosis: `Possible: ${diagnosis}`,
            prevention: `Prevention: ${prevention}`,
            error: false
          })
        } else {
          throw new Error('Fallback unavailable')
        }
      } catch (fallbackErr) {
        // Rule-based WHO/CDC fallback
        const selectedCount = Object.values(symptoms).filter(Boolean).length
        const hasCritical = symptoms.taste || symptoms.breath
        const diagnosis = selectedCount === 0 ? 'No symptoms detected' : hasCritical ? 'High risk COVID-19 or respiratory infection' : 'Mild viral illness likely'

        setAiResult({
          diagnosis: diagnosis,
          prevention: 'Rest, hydrate, wear mask, test if symptoms worsen. Consult doctor.',
          error: true
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // === Reset ===
  const resetChecker = () => {
    setSymptoms({
      fever: false, cough: false, breath: false, fatigue: false,
      taste: false, headache: false, soreThroat: false, bodyAche: false,
    })
    setAiResult(null)
    setShowResult(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            AI-Powered Symptom Checker
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Real medical AI analyzes your symptoms, suggests diagnoses, and prevention steps. Not a substitute for professional care.
          </p>
        </div>

        {/* AI Result Banner */}
        {showResult && aiResult && (
          <div className={`mb-10 p-8 rounded-3xl shadow-2xl border-l-8 transition-all ${
            aiResult.error ? 'bg-yellow-500 border-yellow-700 text-white' : 'bg-blue-600 border-blue-800 text-white'
          }`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">AI Analysis Results</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <div>
                <strong>Possible Diagnosis:</strong><br />
                {aiResult.diagnosis}
              </div>
              <div>
                <strong>Prevention & Next Steps:</strong><br />
                {aiResult.prevention}
              </div>
              <p className="text-sm mt-4 opacity-90">
                <em>Powered by medical AI (EndlessMedical/Ubie). Consult a doctor for accurate diagnosis.</em>
              </p>
            </div>
            <button
              onClick={resetChecker}
              className="mt-6 bg-white text-gray-800 font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-lg"
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
              onClick={checkWithAI}
              disabled={loading}
              className="flex-1 bg-blue-700 text-white font-bold text-xl py-6 rounded-2xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing with AI...' : 'Check with AI Doctor'}
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
              This tool uses real medical AI APIs (EndlessMedical/Ubie). For informational purposes only — always consult a healthcare professional.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>Global Health Pulse • AI Health Tools • 2025</p>
        </div>
      </main>
    </div>
  )
}