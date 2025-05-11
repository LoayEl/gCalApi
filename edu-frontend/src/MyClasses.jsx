import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ClassView from "./ClassView.jsx";

export async function loader() {
    const res = await fetch("/my-classes", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch classes");
    return await res.json();
}

export default function MyClasses() {
    const [myEmail, setMyEmail] = useState('');
    const [created, setCreated] = useState([]);
    const [joined, setJoined] = useState([]);
    const classes = useLoaderData();

    useEffect(() => {
        fetch('/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(profile => {
                setMyEmail(profile.email);
                const createdList = classes.filter(c => c.createdBy?.email === profile.email);
                const joinedList = classes.filter(c => c.createdBy?.email !== profile.email);
                setCreated(createdList);
                setJoined(joinedList);
            });
    }, [classes]);

    return (
        <div style={{ padding: 20 }}>
            <h1>My Classes</h1>

            <h2>Created Classes</h2>
            {created.length === 0 ? <p>None</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {created.map(c => <ClassView key={c.id} singleClass={c} />)}
                </ul>
            )}

            <h2>Joined Classes</h2>
            {joined.length === 0 ? <p>None</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {joined.map(c => <ClassView key={c.id} singleClass={c} />)}
                </ul>
            )}
        </div>
    );
}
