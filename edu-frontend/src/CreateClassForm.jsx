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
        <div className="create-modal-overlay" onClick={onClose}>
            <div className="create-modal" onClick={e => e.stopPropagation()}>
                <h2>Create a Class</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="className">Class Name:</label>
                    <input
                        id="className"
                        type="text"
                        placeholder="Enter class name"
                        value={className}
                        onChange={e => setClassName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-filled">
                        Submit
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );

}
