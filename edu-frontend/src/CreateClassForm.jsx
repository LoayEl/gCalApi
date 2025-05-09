// CreateClassForm.jsx
import React, { useState } from 'react';
import './CreateClassForm.css';

export default function CreateClassForm({ onClose }) {
    const [className, setClassName] = useState('');
    const [message,   setMessage]   = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('/create-class', {
                method:      'POST',
                headers:     { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:        JSON.stringify({ name: className }),
            });
            if (res.ok) {
                setMessage('Class created!');
                setClassName('');
            } else {
                setMessage('Failed to create.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error.');
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
