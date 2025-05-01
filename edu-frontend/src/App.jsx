import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import HomePage from './HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/signin" />} />
            </Routes>
        </Router>
    );
}

export default App;
