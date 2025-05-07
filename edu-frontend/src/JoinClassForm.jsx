import React, { useState } from 'react';

export default function JoinClassForm() {
    const [classCode, setClassCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Joining class:", classCode);
        // TODO: send POST request
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Join a Class</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    required
                />
                <button type="submit">Join</button>
            </form>
        </div>
    );
}
