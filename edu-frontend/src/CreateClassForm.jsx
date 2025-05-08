import React, { useState } from 'react'

export default function CreateClassForm(){

    const [className, setClassName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Creating class:", className);
        // TODO: send POST request***
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Create a Class</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}