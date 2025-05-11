import React, { useState } from 'react';

export default function JoinGroupForm() {
    const { classCode, groupCode } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/class/${classCode}/groups/group/${groupCode}/join`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) throw new Error("Join failed");

            alert("Successfully joined!");
            navigate(`/class/${classCode}/groups/${groupCode}`);
        } catch (err) {
            setError("Could not join group. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Join Group</h2>
            <form onSubmit={handleSubmit}>
                <p>You're about to join group: <strong>{groupCode}</strong></p>
                <button type="submit" disabled={loading}>
                    {loading ? "Joining..." : "Confirm Join"}
                </button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
