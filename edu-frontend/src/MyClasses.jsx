import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ClassView from "./ClassView.jsx";

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
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {classes.map((c) => (
                        <ClassView key={c.id} singleClass={c} />
                    ))}
                </ul>
            )}
        </div>
    );
}
