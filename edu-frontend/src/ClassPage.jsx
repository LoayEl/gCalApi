// ClassPage.jsx
import React from 'react';
import { useLoaderData, useNavigate, useParams, Link } from 'react-router-dom';
import GroupView from './GroupView';
import './ClassPage.css';

export async function loader({ params }) {
    const { code } = params;

    // 1) fetch student IDs
    const idsRes = await fetch('/class/student-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
    });
    if (!idsRes.ok) throw new Error('Failed to load student IDs');
    const ids = await idsRes.json();

    // 2) fetch each user
    const students = await Promise.all(
        ids.map(id =>
            fetch(`/user/${id}`, { credentials: 'include' }).then(res => {
                if (!res.ok) throw new Error(`Failed to load user ${id}`);
                return res.json();
            })
        )
    );

    // 3) fetch class + groups
    const [classRes, groupsRes] = await Promise.all([
        fetch(`/class/${code}`, { credentials: 'include' }),
        fetch(`/class/${code}/groups/listgroups`, { credentials: 'include' }),
    ]);
    if (!classRes.ok)  throw new Error('Failed to load class');
    if (!groupsRes.ok) throw new Error('Failed to load groups');

    const classroom = await classRes.json();
    const groups = await groupsRes.json();
    return { classroom, students, groups };
}

export default function ClassPage() {
    const { classroom, students, groups } = useLoaderData();
    const navigate = useNavigate();
    const { code } = useParams();

    return (
        <div className="class-page">
            <header className="class-header">
                <h1>{classroom.title}</h1>
                <p>
                    Class Code:{' '}
                    <span className="class-code">{classroom.code}</span>
                    <button
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(classroom.code)}
                        title="Copy class code"
                    >
                        📋
                    </button>
                </p>
            </header>

            <div className="class-actions">
                <button
                    className="btn-create-group"
                    onClick={() => navigate(`/class/${code}/create-group`)}
                >
                    <span className="icon">👥</span> Create Group
                </button>
            </div>

            <h2 className="groups-title">Groups:</h2>

            <main className="class-main">
                <section className="groups-panel">
                    <ul className="groups-list">
                        {groups.map(g => (
                            <GroupView
                                key={g.code}
                                singleGroup={g}
                                classCode={classroom.code}
                            />
                        ))}
                    </ul>
                </section>

                <aside className="students-panel">
                    <h2>Students</h2>
                    <ul className="students-list">
                        {students.map(s => (
                            <li key={s.userId}>{s.name}</li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
}
