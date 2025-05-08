import React, { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

export async function loader({ params }) {
    const { code } = params;
    const [classRes, studentsRes, groupsRes] = await Promise.all([
        fetch(`/class/${code}`, { credentials: 'include' }),
        fetch(`/class/${code}/students`, { credentials: 'include' }),
        fetch(`/class/${code}/groups`, { credentials: 'include' }),
    ]);

    if (!classRes.ok) throw new Error('Failed to load class');
    if (!studentsRes.ok) throw new Error('Failed to load students');
    if (!groupsRes.ok) throw new Error('Failed to load groups');

    const classroom = await classRes.json();
    const students  = await studentsRes.json();
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
                <h1>{cls.title}</h1>
                <p>Class Code: {cls.code}</p>
            </header>

            <section style={{ display: 'flex', gap: 32, padding: 16 }}>
                <div style={{ flex: 2 }}>
                    <h2>Groups</h2>
                    {groups.map(g => (
                        <div key={g.code} style={{ marginBottom: 8 }}>
                            <strong>{g.title}</strong> (code: {g.code})
                        </div>
                    ))}
                    <button onClick={handleJoinGroup}>Join A Group</button>
                    <button onClick={handleCreateGroup}>Create A Group</button>
                </div>

                <aside style={{ flex: 1 }}>
                    <h2>Students</h2>
                    <ul>
                        {students.map(s => (
                            <li key={s.email}>{s.name}</li>
                        ))}
                    </ul>
                </aside>
            </section>

            {message && <p>{message}</p>}
        </div>
    );
}
