import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useAuthSession } from '../hooks/useAuthSession';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { session, status, sessionError, startSession, logout } = useAuthSession();
  const user = useMemo(() => session ? { id: session.tutorId, name: session.nome } : null, [session]);
  const userType = session ? 'TUTOR' : null;
  const [portalToggle, setPortalToggle] = useState('TUTOR');

  useEffect(() => {
    if (!user) setPortalToggle('TUTOR');
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        session,
        authStatus: status,
        sessionError,
        startSession,
        portalToggle,
        setPortalToggle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
