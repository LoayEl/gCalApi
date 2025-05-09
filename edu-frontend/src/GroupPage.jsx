import React from 'react';
import { useLoaderData } from 'react-router-dom';

//TODO implement event list component etc
import EventList from './EventList';

export async function loader({ params }) {
    const groupCode = params.code;

    // TODO fill with group fetch endpoint
    const res = await fetch(`/group/${groupCode}/details`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch group details');
    const groupData = await res.json();

    return groupData;
}

export default function GroupPage() {
    const { name, activityLog, members, events } = useLoaderData();

    return (
        <div>
            <header>
                <h1>ED Group</h1>
                <div>[icon]</div>
            </header>

            <h2>{name}</h2>

            <div style={{ display: 'flex', gap: 20 }}>
                {/* Left side */}
                <div style={{ flex: 1 }}>
                    <section>
                        <h3>ACTIVITY LOG:</h3>
                        <ul>
                            {activityLog.map((entry, i) => (
                                <li key={i}>• {entry}</li>
                            ))}
                        </ul>
                    </section>

                    <button>Create Event</button>

                    <EventList events={events} />
                </div>

                {/* Right side */}
                <div style={{ width: 200 }}>
                    <h3>Members</h3>
                    <ul>
                        {members.map((m, i) => (
                            <li key={i}>• {m}</li>
                        ))}
                    </ul>

                    <button>Leave Group →</button>
                </div>
            </div>
        </div>
    );
}
