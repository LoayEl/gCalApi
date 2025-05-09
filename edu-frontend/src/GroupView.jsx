import React from 'react';
import { Link } from 'react-router-dom';

export default function GroupView({ singleGroup, classCode  }) {
    if (!singleGroup) return null;

    const memberCount = singleGroup.memberIds?.length ?? 0;

    return (
        <li style={{ marginBottom: 12 }}>
            <Link
                to={`/class/${classCode}/group/${singleGroup.code}`}
                style={{ textDecoration: 'none', color: '#1e90ff' }}
            >
                <strong>{singleGroup.title}</strong>
                <div style={{ fontSize: 14, color: '#555' }}>
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </div>
            </Link>
        </li>
    );
}
