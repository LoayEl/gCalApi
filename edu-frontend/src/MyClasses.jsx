// MyClasses.jsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ClassView from './ClassView';
import './myClasses.css';

export async function loader() {
    const res = await fetch('/my-classes', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
}

export default function MyClasses() {
    const classes = useLoaderData();

    return (
        <div className="myclasses-page">
            <h1 className="page-title">My Classes: </h1>

            {classes.length === 0 ? (
                <p className="empty-state">
                    You are not enrolled in any classes.
                </p>
            ) : (
                <ul className="classes-list">
                    {classes.map(c => (
                        <ClassView key={c.id} singleClass={c} />
                    ))}
                </ul>
            )}
        </div>
    );
}
