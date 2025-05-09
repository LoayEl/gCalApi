// Navbar.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-sm navbar-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/homepage">
                        ED Group
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsibleNavbar"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-classes">
                                    My Classes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-groups">
                                    My Groups
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/link">
                                    Link
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                    My Profile
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* bottom stripe */}
            <div className="navbar-bottom" />

            {/* your routed pages go here */}
            <Outlet />
        </>
    );
}
