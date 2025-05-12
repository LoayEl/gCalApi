// AddEventForm.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddEventForm.css';

export default function AddEventForm({ onClose, onEventAdded }) {
    const { classCode, groupCode } = useParams();
    const [summary, setSummary] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // convert to ISO before sending
        const startISO = new Date(start).toISOString();
        const endISO = new Date(end).toISOString();

        const eventData = {
            summary,
            location,
            description,
            start: { dateTime: startISO, timeZone: 'America/New_York' },
            end:   { dateTime:   endISO, timeZone: 'America/New_York' }
        };

        try {
            const res = await fetch(
                `/class/${classCode}/groups/${groupCode}/calendar/addevent`,
                {
                    method:      'POST',
                    headers:     { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body:        JSON.stringify(eventData)
                }
            );
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to add event');
            }

            const newEvt = await res.json();
            onEventAdded(newEvt);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ae-overlay" onClick={onClose}>
            <div className="ae-modal" onClick={e => e.stopPropagation()}>
                <h2>Add Group Event</h2>
                <form onSubmit={handleSubmit} className="ae-form">
                    <label>Title</label>
                    <input
                        type="text"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        required
                        className="ae-input"
                    />

                    <label>Start</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        required
                        className="ae-input"
                    />

                    <label>End</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        required
                        className="ae-input"
                    />

                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="ae-input"
                    />

                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="ae-textarea"
                    />

                    <button type="submit" className="btn-filled" disabled={loading}>
                        {loading ? 'Adding…' : 'Add Event'}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}
