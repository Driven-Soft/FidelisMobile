import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuthSession } from '../hooks/useAuthSession';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

type AuthState = ReturnType<typeof useAuthSession>;
type UserContextValue = Omit<AuthState, 'status'> & {
  user: { id: number; name: string } | null;
  userType: AuthState['session']['tipo'] | null;
  authStatus: AuthState['status'];
  portalToggle: string;
  setPortalToggle: Dispatch<SetStateAction<string>>;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { session, status, sessionError, startSession, logout } = useAuthSession();
  const user = useMemo(() => session ? { id: session.tipo === 'TUTOR' ? session.tutorId : session.veterinarioId, name: session.nome } : null, [session]);
  const userType = session?.tipo ?? null;
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
