import React from 'react';
import { useLoaderData } from 'react-router-dom';

// the schedule show when implemented
//import EventList from './EventList';

export async function loader({ params }) {
    const { classCode, groupCode } = params;

    const res = await fetch(`/class/${classCode}/groups/${groupCode}/details`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to load group details');

    return await res.json();
}


export default function GroupPage() {
    const { title, memberNames, createdBy } = useLoaderData();

    return (
        <div style={{ padding: 20 }}>
            <header>
                <h1>{title}</h1>
                <p><strong>Created by:</strong> {createdBy}</p>
            </header>

            <section>
                <h2>Members</h2>
                <ul>
                    {memberNames.map((name, i) => (
                        <li key={i}>• {name}</li>
                    ))}
                </ul>
            </section>

            <button>Leave Group</button>
        </div>
    );
}

