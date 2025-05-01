import { useEffect, useState } from 'react';

export default function SignIn() {
    const [authUrl, setAuthUrl] = useState("");

    useEffect(() => {
        fetch('/auth/url')
            .then(response => response.text())
            .then(url => setAuthUrl(url))
            .catch(error => console.error("Error fetching auth URL", error));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Sign in with Google</h1>
            {authUrl ? (
                <a href={authUrl}>
                    <button style={{ padding: "10px 20px", fontSize: "18px" }}>
                        Sign in
                    </button>
                </a>
            ) : (
                <p>Loading sign-in button...</p>
            )}
        </div>
    );
}
