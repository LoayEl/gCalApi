import { useState } from 'react';
import './App.css';

function App() {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/events');  // thanks to proxy
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const text = await response.text(); // your Spring Boot /events returns text
            setEvents(text);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="App">
            <h1>Ed Group - Calendar Events</h1>

            <button onClick={fetchEvents} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Events'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {events && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Events:</h2>
                    <pre>{events}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
