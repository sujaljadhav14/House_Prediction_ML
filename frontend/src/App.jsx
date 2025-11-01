import React, { useEffect, useState } from 'react'

export default function App() {
    const [locations, setLocations] = useState([])
    const [location, setLocation] = useState('')
    const [totalSqft, setTotalSqft] = useState('1000')
    const [bath, setBath] = useState('2')
    const [bhk, setBhk] = useState('2')

    // Features data for the UI
    const features = [
        {
            title: "Machine Learning",
            description: "Advanced ML models for accurate predictions",
            icon: "🤖"
        },
        {
            title: "Real-Time",
            description: "Instant price predictions",
            icon: "⚡"
        },
        {
            title: "Location Based",
            description: "Considers prime locations in Bengaluru",
            icon: "📍"
        }
    ]
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('http://localhost:5000/locations')
            .then((res) => res.json())
            .then((data) => {
                if (data.locations && data.locations.length) {
                    setLocations(data.locations)
                    setLocation(data.locations[0])
                }
            })
            .catch(() => { })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        // Basic frontend validation
        if (parseFloat(totalSqft) < 300) {
            setResult('Error: Total square feet should be at least 300')
            setLoading(false)
            return
        }
        if (parseFloat(bath) < 1) {
            setResult('Error: Number of bathrooms should be at least 1')
            setLoading(false)
            return
        }
        if (parseInt(bhk) < 1) {
            setResult('Error: BHK should be at least 1')
            setLoading(false)
            return
        }
        if (parseFloat(totalSqft) < parseInt(bhk) * 300) {
            setResult(`Error: ${totalSqft} sq ft seems too small for ${bhk} BHK. Consider at least ${bhk * 300} sq ft`)
            setLoading(false)
            return
        }

        try {
            const resp = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location, total_sqft: parseFloat(totalSqft), bath: parseFloat(bath), bhk: parseInt(bhk) })
            })
            const data = await resp.json()
            if (resp.ok) {
                // Expect predicted_price_lakh and predicted_price_inr from backend
                setResult({
                    lakh: data.predicted_price_lakh,
                    inr: data.predicted_price_inr,
                    warning: data.warning
                })
            } else {
                setResult('Error: ' + (data.error || 'Unknown'))
            }
        } catch (err) {
            setResult('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="hero">
                <h1>Bengaluru House Price Predictor</h1>
                <p>Get instant price predictions for your dream home in Bengaluru using our advanced ML model</p>
            </div>

            <div className="container">
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="form">
                        <label>
                            Location
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                {locations.length === 0 && <option>Loading...</option>}
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Total Sqft
                            <input type="number" value={totalSqft} onChange={(e) => setTotalSqft(e.target.value)} />
                        </label>

                        <label>
                            Bath
                            <input type="number" step="1" value={bath} onChange={(e) => setBath(e.target.value)} />
                        </label>

                        <label>
                            BHK
                            <input type="number" step="1" value={bhk} onChange={(e) => setBhk(e.target.value)} />
                        </label>

                        <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
                    </form>

                    {result !== null && (
                        <div className="result">
                            <h2>Predicted Price</h2>
                            {typeof result === 'object' ? (
                                <div>
                                    <div className="price-display">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.inr)}
                                    </div>
                                    <div className="price-secondary">
                                        Approximately {result.lakh} Lakhs
                                    </div>
                                </div>
                            ) : (
                                <p>{result}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="features">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <footer className="footer">
                    <p>Made by <a href="https://github.com/sujaljadhav14" target="_blank" rel="noopener noreferrer">Sujal Jadhav</a></p>
                    <p>B.E. Artificial Intelligence & Data Science @ Terna Engineering College</p>
                </footer>
            </div>
        </div>
    )
}
