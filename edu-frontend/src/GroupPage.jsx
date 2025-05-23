import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams, Link, useNavigate } from 'react-router-dom';
import Loading from "./Loading.jsx";
import AddEventForm from "./AddEventForm.jsx"

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
    const classCode = params.classCode || group.classCode;
    const { title, memberNames, createdBy, code } = group;
    const [userInGroup, setUserInGroup] = useState(profile.email === createdBy || memberNames.includes(profile.name));
    const navigate = useNavigate();

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarId, setCalendarId] = useState(null);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await fetch(`/calendar/group/${groupCode}/display`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Calendar fetch failed');
                const data = await res.json();
                setCalendarEvents(data || []);
            } catch (err) {
                console.error("Calendar fetch error:", err);
                setError("Could not load group calendar.");
            } finally {
                setLoading(false);
            }
        };

        const fetchCalendarId = async () => {
            try {
                const res = await fetch(`/calendar/group/${groupCode}/info`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to load calendar info');
                const data = await res.json();
                setCalendarId(data.calendarId);
            } catch (err) {
                console.error("Failed to load calendar ID:", err);
            }
        };

        fetchCalendar();
        fetchCalendarId();
    }, [groupCode]);

    const handleShare = () => {
        navigator.clipboard.writeText(code);
        alert("Group code copied!");
    };

    const handleLeave = async () => {
        try {
            const res = await fetch(`/class/${classCode}/groups/group/${groupCode}/leave`, {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                alert("You left the group.");
                setUserInGroup(false);
                navigate("/my-groups");
            } else {
                alert("Failed to leave group.");
            }
        } catch (err) {
            console.error("Leave group error:", err);
            alert("An error occurred.");
        }
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

            {userInGroup && (
                <button onClick={handleShare}>Share Group Invite</button>
            )}

            <section>
                <h2>Group Calendar</h2>

                <section>
                    <h2>Google Calendar View</h2>
                    {calendarId ? (
                        <iframe
                            src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America/New_York`}
                            style={{ border: 0 }}
                            width="800"
                            height="600"
                            frameBorder="0"
                            scrolling="no"
                            title="Group Calendar"
                        ></iframe>
                    ) : (
                        <Loading message="Loading calendar..." />
                    )}
                </section>

                {!loading && !error && calendarEvents.length > 0 && (
                  <ul>
                    {calendarEvents.map(ev => {
                      // raw time
                      const rawStart = ev.start?.dateTime?.value ?? ev.start?.dateTime;
                      const rawEnd   = ev.end  ?.dateTime?.value ?? ev.end  ?.dateTime;

                      // convert to js format for display
                      const startDate = new Date(rawStart);
                      const endDate   = new Date(rawEnd);

                      return (
                        <li key={ev.id}>
                          <strong>{ev.summary}</strong><br/>
                          Starts: {startDate.toLocaleString()}<br/>
                          Ends:   {endDate.toLocaleString()}<br/>
                          {ev.location && <em>{ev.location}</em>}
                        </li>
                      );
                    })}
                  </ul>
                )}

            </section>

            {calendarId && (
                <a
                    href={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America/New_York`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Full Calendar in Google
                </a>
            )}

            {userInGroup ? (
                <>
                <button onClick={handleLeave}>Leave Group</button>
                  <Link to={`/class/${classCode}/groups/${groupCode}/add-event`}>
                    <button>Add Event</button>
                  </Link>
                </>
            ) : (
                <Link to={`/class/${classCode}/groups/${groupCode}/join`}>
                    <button>Join Group</button>
                </Link>
            )}
        </div>
    );
}
