// HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:8080/events', {
                method: 'GET',
                credentials: 'include',
            });

            // 1) read the raw text
            const text = await res.text();
            console.log("🔍 raw response:", text);

            // 2) split off the header line, drop empty lines
            const lines = text
                .split("\n")
                .slice(1)
                .filter(line => line.trim().length > 0);

            // 3) map "Summary (YYYY-MM-DD…)" → { summary, start: { dateTime } }
            const list = lines.map(line => {
                const m = line.match(/^(.*) \((.*)\)$/);
                return {
                    summary: m ? m[1] : line,
                    start: { dateTime: m ? m[2] : "" }
                };
            });

            console.log("✅ mapped events:", list);
            setEvents(list);
        } catch (e) {
            console.error("Error fetching events:", e);
        }
    };

    return (
        <div className="homepage-container">
            {/* Welcome Card */}
            <section className="welcome-card">
                <h1 className="card-title">Welcome to ED Group</h1>
                <p className="card-subtext">
                    Organize, join, and collaborate with your class teams easily.
                </p>
                <div className="button-group">
                    <Link to="/create-classform">
                        <button className="button-primary">Create Class</button>
                    </Link>
                    <Link to="/join-classform">
                        <button className="button-outline">Join Class</button>
                    </Link>
                </div>
            </section>

            {/* Events Section */}
            <section className="events-section">
                <h2>Calendar Events</h2>
                <button onClick={fetchEvents} className="button-small">
                    Fetch Events
                </button>

                {events.length > 0 ? (
                    <div className="events-list">
                        {events.map(evt => (
                            <div className="event-item" key={evt.summary + evt.start.dateTime}>
                                <h3>{evt.summary}</h3>
                                <p>
                                    {new Date(evt.start.dateTime).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-events">No events yet.</p>
                )}
            </section>
        </div>
    );
}
