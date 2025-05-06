import React, { useState } from 'react'


export default function HomePage() {
    const [events, setEvents] = useState(null)

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:8080/events');
            const text = await res.text();
            console.log("fetched event from beck" + res);
            setEvents(text);
        } catch (e) {
            console.log("Error:", e.message);
        }
    }


    return (

        <div style={{ padding: 20 }}>

            <div>
                <h1>Welcome to the Home Page!</h1>
            </div>

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
