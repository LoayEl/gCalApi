import React from 'react';
import { useLoaderData } from 'react-router-dom';
import GroupView from './GroupView';

export async function loader() {
    const res = await fetch('/my-groups', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch groups');
    return await res.json();
}

export default function MyGroups() {
    const groups = useLoaderData();

    return (
        <div style={{ padding: 20 }}>
            <h1>My Groups</h1>
            {groups.length === 0 ? (
                <p>You are not in any groups.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {groups.map(g => (
                        <GroupView key={g.code} singleGroup={g} classCode={g.classCode} />
                    ))}
                </ul>
            )}
        </div>
    );
}
