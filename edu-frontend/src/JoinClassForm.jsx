import React, { useState } from 'react';

const JoinClassForm = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ code }),
            });

            const result = await response.json();

            if(result)
            {setMessage("joined sucessfully");}
            else
            {setMessage("could not join, or already joined");}

        } catch (err) {
            console.error(err);
            setMessage("Server error");
        }
    };


    return (
        <form onSubmit={handleJoin}>
            <label>
                Class Code:
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Join</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default JoinClassForm;
