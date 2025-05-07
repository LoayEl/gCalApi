// main.jsx or index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";

import Navbar from './Navbar';
import SignIn from './SignIn';
import HomePage from './HomePage';
import ProtectedRoute from "./ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navbar />,
        children: [
            {
                index: true,
                element: <Navigate to="/signin" />
            },
            {
                path: 'signin',
                element: <SignIn />
            },
            {
                path: 'homepage',
                element: (
                    <HomePage />
                )
            },
            {
                path: '*',
                element: <Navigate to="/signin" />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
