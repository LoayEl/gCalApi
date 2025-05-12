// GroupPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    useLoaderData,
    useParams,
    Link,
    useNavigate
} from 'react-router-dom';
import Loading from './Loading.jsx';
import AddEventForm from './AddEventForm';
import JoinGroupForm from './JoinGroupForm';
import './GroupPage.css';

export async function loader({ params }) {
    const { classCode, groupCode } = params;
    // fetch group details
    const r1 = await fetch(`/class/${classCode}/groups/${groupCode}/details`, { credentials: 'include' });
    if (!r1.ok) throw new Error('Failed to load group');
    const group   = await r1.json();
    // fetch profile
    const r2 = await fetch('/profile', { credentials: 'include' });
    if (!r2.ok) throw new Error('Failed to load profile');
    const profile = await r2.json();
    return { group, profile };
}

export default function GroupPage() {
    const { group, profile } = useLoaderData();
    const { classCode, groupCode } = useParams();
    const navigate = useNavigate();

    // local join/leave state
    const [userInGroup, setUserInGroup] = useState(
        profile.email === group.createdBy ||
        group.memberNames.includes(profile.name)
    );

    // upcoming events + calendar
    const [events, setEvents]     = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [eventsError, setEventsError]     = useState(null);
    const [calendarId, setCalendarId]       = useState(null);
    const [reloadCalKey, setReloadCalKey]   = useState(0);

    // modals
    const [showAddModal,  setShowAddModal]  = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // fetch upcoming events
    const fetchEvents = useCallback(async () => {
        setLoadingEvents(true);
        setEventsError(null);
        try {
            const r = await fetch(`/group/${groupCode}/calendar/display`, { credentials: 'include' });
            if (!r.ok) throw new Error();
            setEvents(await r.json());
        } catch {
            setEventsError('Could not load events');
        } finally {
            setLoadingEvents(false);
        }
    }, [groupCode]);

    // fetch calendar embed ID
    const fetchCalId = useCallback(async () => {
        try {
            const r = await fetch(`/group/${groupCode}/calendar/info`, { credentials: 'include' });
            if (r.ok) setCalendarId((await r.json()).calendarId);
        } catch {}
    }, [groupCode]);

    useEffect(() => {
        fetchEvents();
        fetchCalId();
    }, [fetchEvents, fetchCalId]);

    // after add-event
    const handleEventAdded = newEvt => {
        setEvents(es => [newEvt, ...es]);
        setReloadCalKey(k => k + 1);
    };

    // share
    const handleShare = () => {
        navigator.clipboard.writeText(group.code);
        alert('Group code copied!');
    };

    // leave
    const handleLeave = async () => {
        const r = await fetch(
            `/class/${classCode}/groups/group/${groupCode}/leave`,
            { method: 'POST', credentials: 'include' }
        );
        if (r.ok) {
            setUserInGroup(false);
            alert('Left group');
        } else {
            alert('Could not leave');
        }
    };

    // join
    const handleJoined = () => {
        setUserInGroup(true);
        setShowJoinModal(false);
        fetchEvents();
        setReloadCalKey(k => k + 1);
    };

    return (
        <>
            <div className={`group-page${(showAddModal||showJoinModal) ? ' blur' : ''}`}>
                <header className="group-header">
                    <h1 className="group-title">{group.title}</h1>
                    <p className="group-subtitle">
                        Created by <strong>{group.createdBy}</strong>
                    </p>
                </header>

                <div className="group-content">
                    {/* left side */}
                    <div className="group-main">
                        {/* calendar */}
                        <div className="panel-card">
                            <div className="panel-header">
                                <h2 className="section-title">Calendar View</h2>
                            </div>
                            {calendarId
                                ? <iframe
                                    key={reloadCalKey}
                                    className="calendar-iframe"
                                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America/New_York`}
                                    frameBorder="0"
                                    scrolling="no"
                                />
                                : <Loading message="Loading calendar…" />
                            }
                        </div>

                        {/* upcoming events */}
                        <div className="panel-card">
                            <div className="panel-header">
                                <h2 className="section-title">Upcoming Events</h2>
                                {userInGroup && (
                                    <button
                                        className="btn-create-event"
                                        onClick={() => setShowAddModal(true)}
                                    >➕ Add Event</button>
                                )}
                            </div>
                            {loadingEvents
                                ? <Loading message="Loading events…" />
                                : eventsError
                                    ? <p className="error">{eventsError}</p>
                                    : events.length === 0
                                        ? <p>No upcoming events.</p>
                                        : <ul className="events-list">
                                            {events.map(ev => {
                                                const rs = ev.start?.dateTime || ev.start?.date || '';
                                                const re = ev.end  ?.dateTime || ev.end  ?.date || '';
                                                const sd = rs ? new Date(rs).toLocaleString() : '—';
                                                const ed = re ? new Date(re).toLocaleString() : '—';
                                                return (
                                                    <li key={ev.id||ev.summary+rs} className="event-item">
                                                        <strong>{ev.summary}</strong>
                                                        <div className="event-times">
                                                            Start: {sd}<br/>End: {ed}
                                                        </div>
                                                        {ev.location && <div className="event-location">{ev.location}</div>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                            }
                        </div>
                    </div>

                    {/* right sidebar */}
                    <aside className="group-sidebar">
                        <div className="panel-card">
                            <h2 className="section-title">Members</h2>
                            <ul className="members-list">
                                {group.memberNames.map((n,i) => <li key={i}>{n}</li>)}
                            </ul>
                            <div className="sidebar-actions">
                                {userInGroup
                                    ? <button className="btn-leave" onClick={handleLeave}>🚪 Leave Group</button>
                                    : <button className="btn-join" onClick={() => setShowJoinModal(true)}>🤝 Join Group</button>
                                }
                                <button className="btn-share" onClick={handleShare}>📋 Copy Code</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {showAddModal && (
                <AddEventForm
                    onClose={() => setShowAddModal(false)}
                    onEventAdded={handleEventAdded}
                />
            )}
            {showJoinModal && (
                <JoinGroupForm
                    onClose={() => setShowJoinModal(false)}
                    onJoin={handleJoined}
                />
            )}
        </>
    );
}
