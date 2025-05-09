import React from 'react';
import { Link } from 'react-router-dom';

export default function ClassView({ singleClass }) {
    if (!singleClass) return null;

    return (
        <li style={{ marginBottom: 12 }}>
            <Link
                to={`/class/${singleClass.code}`}
                style={{ textDecoration: 'none', color: '#1e90ff' }} // changed color
            >
                <strong>{singleClass.title}</strong>
                <div style={{ fontSize: 14, color: '#555' }}>
                    {singleClass.description}
                </div>
            </Link>
        </li>
    );
}
