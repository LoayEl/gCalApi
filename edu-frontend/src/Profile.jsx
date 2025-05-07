import React, { useEffect, useState } from 'react';
import {useLoaderData} from "react-router-dom";

export async function loader() {
    const res = await fetch("/profile", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return await res.json();
}

export default function Profile() {

    const user = useLoaderData();
    const { name, email, userId } = user;



    return (
        <div style={{ padding: 20 }}>
            <h1>My Profile</h1>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>
    );
}
