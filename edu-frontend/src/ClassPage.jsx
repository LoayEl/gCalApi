import React, { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import GroupView from './GroupView';

    export async function loader({ params }) {
        const { code } = params;

        //  get student ids
        const idsRes = await fetch('/class/student-ids', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code })
        });
        if (!idsRes.ok) throw new Error('Failed to load student IDs');
        const ids = await idsRes.json();

        //  fetch each user
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


        return (
            <div>
                <header style={{ background: '#800', color: '#fff', padding: 16 }}>
                    <h1>{classroom.title}</h1>
                    <p>Class Code: {classroom.code}</p>
                </header>

                <button onClick={() => navigate(`/class/${code}/create-group`)}>
                    Create Group
                </button>

                <section style={{ display: 'flex', gap: 32, padding: 16 }}>
                    <div style={{ flex: 2 }}>
                        <h2>Groups</h2>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {groups.map(g => (
                                <GroupView key={g.code} singleGroup={g} classCode={classroom.code} />
                            ))}
                        </ul>
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
