import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

export async function loader({ params }) {
    const { classCode, groupCode } = params;

    const res = await fetch(`/class/${classCode}/groups/${groupCode}/details`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to load group details');
    const group = await res.json();

    const profileRes = await fetch('/profile', { credentials: 'include' });
    if (!profileRes.ok) throw new Error('Failed to load profile');
    const profile = await profileRes.json();

    return { group, profile };
}

export default function GroupPage() {
    const { group, profile } = useLoaderData();
    const params = useParams();
    const groupCode = params.groupCode || group.code;

    const { title, memberNames, createdBy, code } = group;

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isPartOfGroup =
        profile.email === createdBy || memberNames.includes(profile.name);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await fetch(`/group/${groupCode}/calendar/display`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Calendar fetch failed');
                const data = await res.json();
                setCalendarEvents(data.events || []);
            } catch (err) {
                console.error("Calendar fetch error:", err);
                setError("Could not load group calendar.");
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [groupCode]);

    const handleShare = () => {
        navigator.clipboard.writeText(code);
        alert("Group code copied!");
    };

    return (
        <div style={{ padding: 20 }}>
            <header>
                <h1>{title}</h1>
                <p><strong>Created by:</strong> {createdBy}</p>
            </header>

            <section>
                <h2>Members</h2>
                <ul>
                    {memberNames.map((name, i) => (
                        <li key={i}>• {name}</li>
                    ))}
                </ul>
            </section>

            {isPartOfGroup && (
                <button onClick={handleShare}>Share Group Invite</button>
            )}

            <section>
                <h2>Group Calendar</h2>
                {loading ? (
                    <p>Loading events...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : calendarEvents.length === 0 ? (
                    <p>No upcoming events.</p>
                ) : (
                    <ul>
                        {calendarEvents.map((event, i) => (
                            <li key={i}>
                                <strong>{event.summary}</strong><br />
                                {new Date(event.start?.dateTime).toLocaleString()} → {new Date(event.end?.dateTime).toLocaleString()}<br />
                                {event.location && <em>{event.location}</em>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <button>Leave Group</button>
        </div>
    );
}
