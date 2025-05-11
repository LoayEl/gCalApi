import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from "./Loading.jsx";

export default function CreateGroupForm() {
    const { classCode } = useParams();
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`/class/${classCode}/groups/creategroup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title })
            });

            if (!res.ok) throw new Error('Failed to create group');
            const group = await res.json();
            navigate(`/class/${classCode}/group/${group.code}`);
        } catch (err) {
            console.error(err);
            setError("Could not create group.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Create Group</h1>
            {loading ? (
                <Loading message="Creating group..." />
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Group Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <br /><br />
                    <button type="submit">Create</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
        </div>
    );
}
