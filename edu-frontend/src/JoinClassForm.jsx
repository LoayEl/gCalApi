import React, { useState } from 'react';
import './JoinClass.css';

export default function HomePage() {
    const [showModal, setShowModal] = useState(false);
    const [code,      setCode]      = useState('');
    const [message,   setMessage]   = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/join', {
                method:      'POST',
                headers:     { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:        JSON.stringify({ code }),
            });
            const joined = await res.json();
            setMessage(joined
                ? 'Joined successfully!'
                : 'Could not join or already joined.'
            );
        } catch (err) {
            console.error(err);
            setMessage('Server error');
        }
    };

    return (
        <>
            {/* — Homepage content — */}
            <div className={`homepage${showModal ? ' blur' : ''}`}>
                <h1 className="homepage-title">Welcome to ED-Group</h1>
                {/* …other homepage elements… */}
                <button
                    className="join-btn"
                    onClick={() => setShowModal(true)}
                >
                    Join Class
                </button>
            </div>

            {/* — Modal overlay — */}
            {showModal && (
                <div
                    className="join-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="join-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleJoin}>
                            <label htmlFor="classCode">Enter Code:</label>
                            <input
                                id="classCode"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-filled"
                            >
                                Join
                            </button>
                            {message && (
                                <p className="message">{message}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
