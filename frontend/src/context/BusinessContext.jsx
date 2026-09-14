// src/context/BusinessContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/Api';

const BusinessContext = createContext();

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error('useBusiness must be used within BusinessProvider');
    }
    return context;
};

export const BusinessProvider = ({ children }) => {
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [businessTypes, setBusinessTypes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        // Halaman publik yang tidak membutuhkan login
        if (path === '/' || path === '/login' || path === '/register' || path === '/panduan') {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            // not logged in → redirect to login page using router navigation
            navigate('/login', { replace: true });
            return;
        }
        // fetch data once after component mounts
        const fetchData = async () => {
            try {
                const userRes = await api.get('/users/profile');
                const user = userRes.data.data;
                const typesRes = await api.get('/business/types');
                setBusinessTypes(typesRes.data.data);
                if (user.business_type_id) {
                    const current = typesRes.data.data.find(b => b.id === user.business_type_id);
                    setSelectedBusiness(current);
                }
            } catch (error) {
                console.error('Error fetching business:', error);
            }
        };
        fetchData();
    }, [navigate, location.pathname]);

    const switchBusiness = (business) => {
        setSelectedBusiness(business);
        localStorage.setItem('selectedBusiness', JSON.stringify(business));
    };

    return (
        <BusinessContext.Provider value={{
            selectedBusiness,
            businessTypes,
            switchBusiness,
            refreshBusiness: async () => {
                try {
                    const userRes = await api.get('/users/profile');
                    const user = userRes.data.data;
                    const typesRes = await api.get('/business/types');
                    setBusinessTypes(typesRes.data.data);
                    if (user.business_type_id) {
                        const current = typesRes.data.data.find(b => b.id === user.business_type_id);
                        setSelectedBusiness(current);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }}>
            {children}
        </BusinessContext.Provider>
    );
};