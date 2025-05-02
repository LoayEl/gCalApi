import React, { useState } from 'react'

export default function HomePage() {
    const [events, setEvents] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchEvents = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/events')
            if (!res.ok) throw new Error('Fetch failed')
            const text = await res.text()
            setEvents(text)
        } catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Calendar Events</h1>
            <button onClick={fetchEvents} disabled={loading}>
                {loading ? 'Loading…' : 'Fetch Events'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {events && (
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
          {events}
        </pre>
            )}
        </div>
    )
}
