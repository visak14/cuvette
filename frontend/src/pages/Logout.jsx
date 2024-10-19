// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('email'); 
        dispatch({ type: 'LOGOUT' });
        navigate('/'); 
    }, [dispatch, navigate]);

    return <p>Logging out...</p>;
};

export default Logout;
