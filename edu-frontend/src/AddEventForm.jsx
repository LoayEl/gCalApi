import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AddEventForm() {
  const { groupCode } = useParams();
  const [summary, setSummary] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const eventData = {
      summary,
      location,
      description,
      start: { dateTime: start, timeZone: 'America/New_York' },
      end:   { dateTime: end,   timeZone: 'America/New_York' }
    };

    try {
      const res = await fetch(
        `/group/${groupCode}/calendar/addevent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventData)
        }
      );
      if (!res.ok) throw new Error(await res.text() || 'Failed to add event');
      setSuccess(true);
      setSummary(''); setStart(''); setEnd(''); setLocation(''); setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Add Group Event</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="Event title"
          required
        /><br/>
        <input
          type="datetime-local"
          value={start}
          onChange={e => setStart(e.target.value)}
          required
        /><br/>
        <input
          type="datetime-local"
          value={end}
          onChange={e => setEnd(e.target.value)}
          required
        /><br/>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
        /><br/>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        /><br/>
        <button type="submit">Add Event</button>
      </form>
      {success && <p style={{ color: 'green' }}>Event added!</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
