import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'TUTOR' ou 'VET'
  const [portalToggle, setPortalToggle] = useState('TUTOR');

  const loginTutor = (tutorData) => {
    setUser(tutorData);
    setUserType('TUTOR');
  };

  const loginVet = (vetData) => {
    setUser(vetData);
    setUserType('VET');
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setPortalToggle('TUTOR');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        portalToggle,
        setPortalToggle,
        loginTutor,
        loginVet,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
