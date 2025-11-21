import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatDate = (d) => {
  const date = new Date(d);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const API = "https://disease.sh/v3/covid-19";

export default function GlobalCases() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [trend, setTrend] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async (country = "") => {
    setLoading(true);
    try {
      const requests = [
        fetch(`${API}/${country ? `countries/${country}` : "all"}?strict=true`),
        countries.length === 0 ? fetch(`${API}/countries`) : null,
        !country ? fetch(`${API}/historical/all?lastdays=30`) : null,
      ].filter(Boolean);

      const [statsRes, countriesRes, trendRes] = await Promise.all(requests);

      const stats = await statsRes.json();
      setData(stats);

      if (countriesRes) {
        const list = await countriesRes.json();
        setCountries(list.map(c => c.country).filter(Boolean).sort());
      }

      if (trendRes) {
        const hist = await trendRes.json();
        const formatted = Object.keys(hist.cases || {}).map(date => ({
          date: formatDate(date),
          cases: hist.cases[date],
          deaths: hist.deaths?.[date] || 0,
          recovered: hist.recovered?.[date] || 0,
        }));
        setTrend(formatted);
      } else {
        setTrend([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    const c = search.trim();
    if (c && countries.includes(c)) {
      setSelectedCountry(c);
      loadData(c);
    }
  };

  const reset = () => {
    setSelectedCountry("");
    setSearch("");
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            {selectedCountry || "Global COVID-19 Dashboard"}
          </h1>
          <p className="mt-3 text-lg opacity-90">Real-time • Accurate • Updated Frequently</p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 bg-yellow-400 text-blue-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-300 transition shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Search Bar */}
        {!selectedCountry && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                list="country-list"
                placeholder="Search country..."
                className="flex-1 px-6 py-5 rounded-full border border-gray-300 text-lg outline-none shadow-md focus:shadow-lg transition"
              />
              <button
                onClick={handleSearch}
                className="px-10 py-5 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition shadow-md"
              >
                View
              </button>
            </div>
            <datalist id="country-list">
              {countries.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        )}

        {selectedCountry && (
          <div className="text-center mb-8">
            <button onClick={reset} className="text-blue-700 font-bold text-lg hover:underline">
              Back to Global
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stat Cards – Smaller, cleaner numbers */}
        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Total Cases */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-blue-600">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-700">Total Cases</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-blue-600 mt-2">
                  {(data.cases || 0).toLocaleString()}
                </p>
                {data.todayCases > 0 && (
                  <p className="text-red-600 font-medium text-sm mt-2">
                    +{(data.todayCases || 0).toLocaleString()} today
                  </p>
                )}
              </div>
            </div>

            {/* Active Cases */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-yellow-500">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-700">Active Cases</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-yellow-600 mt-2">
                  {(data.active || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recovered */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-green-600">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-700">Recovered</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-green-600 mt-2">
                  {(data.recovered || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Deaths */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-red-700">
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-700">Total Deaths</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-red-700 mt-2">
                  {(data.deaths || 0).toLocaleString()}
                </p>
                {data.todayDeaths > 0 && (
                  <p className="text-red-800 font-medium text-sm mt-2">
                    +{(data.todayDeaths || 0).toLocaleString()} today
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        {!selectedCountry && trend.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
              30-Day Global Trend
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e3a8a", borderRadius: "12px", color: "white" }} />
                <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 py-8 text-gray-600 border-t">
          <p className="text-sm md:text-base">
            Powered by <strong className="text-blue-700">disease.sh</strong> • Real-time Data
          </p>
        </div>
      </div>
    </div>
  );
}