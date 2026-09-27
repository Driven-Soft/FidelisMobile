import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthSession } from '../hooks/useAuthSession';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { AuthSession, AuthStatus, PortalType, UserType } from '../models/auth';

interface UserContextValue {
  user: { id: number | null; name: string } | null;
  userType: UserType | null;
  session: AuthSession | null;
  authStatus: AuthStatus;
  sessionError: string | null;
  startSession: (session: AuthSession) => Promise<void>;
  logout: () => Promise<void>;
  portalToggle: PortalType;
  setPortalToggle: Dispatch<SetStateAction<PortalType>>;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);

// Restringe o tipo sem presumir que um Provider exista fora da árvore do app.
export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('UserContext requer UserProvider.');
  return context;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { session, status, sessionError, startSession, logout } = useAuthSession();
  const user = useMemo(() => session ? { id: session.tipo === 'TUTOR' ? session.tutorId : session.veterinarioId, name: session.nome } : null, [session]);
  const userType = session?.tipo ?? null;
  const [portalToggle, setPortalToggle] = useState<PortalType>('TUTOR');

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
