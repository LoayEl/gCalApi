import React, { useEffect, useState } from 'react';


export default function Profile() {

    const [user, setUser] = useState(null);

    //TODO; FILL W OUR SPRINGBOOT ENDPOINT
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/userid/profile`); //EX ENDPOINT TO FETCHUSER DATA
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return <div style={{ padding: 20 }}>waiting on user info...</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>My Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}
