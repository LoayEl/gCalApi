import React, { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

export async function loader({ params }) {
    const { code } = params;

    // 1) get student ids
    const idsRes = await fetch('/class/student-ids', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code })
    });
    if (!idsRes.ok) throw new Error('Failed to load student IDs');
    const ids = await idsRes.json();

    // 2) fetch each user
    const students = await Promise.all(
        ids.map(id =>
            fetch(`/user/${id}`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load user ${id}`);
                    return res.json();
                })
        )
    );

    //  fetch class n groups
    const [classRes, groupsRes] = await Promise.all([
        fetch(`/class/${code}`,                    { credentials: 'include' }),
        fetch(`/class/${code}/groups/listgroups`,  { credentials: 'include' })  // ← fixed URL
    ]);
    if (!classRes.ok)  throw new Error('Failed to load class');
    if (!groupsRes.ok) throw new Error('Failed to load groups');

    const classroom = await classRes.json();
    const groups    = await groupsRes.json();
    return { classroom, students, groups };
}


export default function ClassPage() {
    const { classroom, students, groups } = useLoaderData();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { code } = useParams();

    const handleJoinGroup = async () => {
        // class/join-group page
        //shows a list of the current classes groups and u can click join on them to join
    };

    const handleCreateGroup = async () => {
        //redirect to create group page who knoews what class ur making a group in
        //class/create-group
    };

    return (
        <div>
            <header style={{ background: '#800', color: '#fff', padding: 16 }}>
                <h1>{classroom.title}</h1>
                <p>Class Code: {classroom.code}</p>
            </header>

            <section style={{ display: 'flex', gap: 32, padding: 16 }}>
                <div style={{ flex: 2 }}>
                    <h2>Groups</h2>
                    {groups.map((g) => (
                        <div key={g.code} style={{ marginBottom: 8 }}>
                            <strong>{g.title}</strong> (code: {g.code})
                        </div>
                    ))}
                </div>
                <aside style={{ flex: 1 }}>
                    <h2>Students</h2>
                    <ul>
                        {students.map(s => (
                            <li key={s.userId}>
                                {s.name} ({s.email})
                            </li>
                        ))}
                    </ul>
                </aside>

            </section>
        </div>
    );
}
