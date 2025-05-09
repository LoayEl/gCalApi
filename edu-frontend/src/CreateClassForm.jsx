import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateClassForm() {
    const [className, setClassName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch('/class/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title: className })
            });

            if (!res.ok) throw new Error("Failed to create class");

            const newClass = await res.json();
            navigate(`/class/${newClass.code}`);
        } catch (err) {
            console.error(err);
            setError("Could not create class. Try again.");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Create a Class</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    style={{ marginRight: 10 }}
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
