import React from 'react';
import { useLoaderData } from 'react-router-dom';

export async function loader() {
    const res = await fetch("/my-classes", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch classes");
    return await res.json();
}

export default function MyClasses() {
    const classes = useLoaderData();

    return (
        <div style={{ padding: 20 }}>
            <h1>My Classes</h1>
            {classes.length === 0 ? (
                <p>You are not enrolled in any classes.</p>
            ) : (
                <ul>
                    {classes.map((c) => (
                        <li key={c.id}>
                            <strong>{c.title}</strong> — {c.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
