import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function HomePage() {
    const [events, setEvents] = useState(null)

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:8080/events', {
                method: 'GET',
                credentials: 'include', // gets same session from back
            });
            const text = await res.text();
            console.log("fetched event from backend", text);
            setEvents(text);
        } catch (e) {
            console.log("Error:", e.message);
        }
    };


    return (

        <div style={{ padding: 20 }}>

            <div>
                <h1>Welcome to the Home Page!</h1>
            </div>

            <Link to="/create-classform">
                <button>Create Class</button>
            </Link>

            <Link to="/join-classform">
                <button>Join Class</button>
            </Link>

            <h1>Calendar Events</h1>
            <button onClick={fetchEvents}>
                Fetch Events
            </button>
            {events && (
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
                    {events}
                </pre>
            )}
        </div>
    )
}
