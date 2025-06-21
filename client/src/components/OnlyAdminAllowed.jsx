import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'

// This component is used to protect routes that require authentication

const OnlyAdminAllowed = () => {
    const user = useSelector((state) => state.user);

    if(user && user.isLoggedIn && user.user.role === 'admin') {
        // If user is logged in, allow access to the route
        return <Outlet/>
    }else{
        return<Navigate to={RouteSignIn} replace={true} />
    }
 
}

export default OnlyAdminAllowed