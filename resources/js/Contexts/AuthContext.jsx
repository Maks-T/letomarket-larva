import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('login'); // login | code | password

    const openAuth = (initialView = 'login') => {
        setView(initialView);
        setIsOpen(true);
    };

    const closeAuth = () => setIsOpen(false);

    return (
        <AuthContext.Provider value={{ isOpen, openAuth, closeAuth, view, setView }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
