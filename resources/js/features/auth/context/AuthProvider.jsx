import {createContext, useContext, useState, useMemo, useCallback} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('login'); // login | code | password | forgot ...

  const openAuth = useCallback((initialView = 'login') => {
    setView(initialView);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({
    isOpen,
    view,
    setView,
    openAuth,
    closeAuth
  }), [isOpen, view, openAuth, closeAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth должен использоваться в AuthProvider');
  }

  return context;
};