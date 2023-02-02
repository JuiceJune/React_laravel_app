import React from 'react';
import {Outlet, Navigate} from 'react-router-dom'
import {useStateContext} from "../contexts/ContextProvider.jsx";

const GuestLayout = () => {

    const {token} = useStateContext()

    if(token) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default GuestLayout;
