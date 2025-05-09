import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

// the schedule show when implemented
//import EventList from './EventList';

export async function loader({ params }) {
    const { classCode, groupCode } = params;
    const res = await fetch(`/class/${classCode}/groups/${groupCode}/details`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to load group details');
    const group = await res.json();

    const profileRes = await fetch('/profile', { credentials: 'include' });
    if (!profileRes.ok) throw new Error('Failed to load profile');
    const profile = await profileRes.json();

    return { group, profile };
}


export default function GroupPage() {
    const { group, profile } = useLoaderData();
    const { title, memberNames, createdBy, code } = group;

    const isPartOfGroup =
        profile.email === createdBy ||
        memberNames.includes(profile.name);  // crude but simple check

    const handleShare = () => {
        navigator.clipboard.writeText(code);
        alert("Group code copied!");
    };

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

            {isPartOfGroup && (
                <button onClick={handleShare}>Share Group Invite</button>
            )}

            <button>Leave Group</button>
        </div>
    );
}


