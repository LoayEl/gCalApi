import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/homepage">Ed-Group</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-classes">My Classes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-groups">My Groups</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/link">Link</Link>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">My Profile</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Outlet />
        </div>
    );
}
