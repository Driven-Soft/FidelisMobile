import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TUTOR_PETS } from '../data/fidelisData';

export const UserContext = createContext();

const STORAGE_KEY_TUTOR_PETS = '@fidelis:tutor_pets';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [portalToggle, setPortalToggle] = useState('TUTOR');
  const [tutorPets, setTutorPets] = useState(MOCK_TUTOR_PETS);

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
    setTutorPets(MOCK_TUTOR_PETS);
  };

  const addTutorPet = (petData) => {
    setTutorPets((current) => [petData, ...current]);
  };

  useEffect(() => {
    if (userType !== 'TUTOR') {
      return;
    }

    const loadTutorPets = async () => {
      try {
        const savedPets = await AsyncStorage.getItem(STORAGE_KEY_TUTOR_PETS);
        if (!savedPets) {
          setTutorPets(MOCK_TUTOR_PETS);
          return;
        }

        const parsedPets = JSON.parse(savedPets);
        setTutorPets(Array.isArray(parsedPets) ? parsedPets : MOCK_TUTOR_PETS);
      } catch (error) {
        setTutorPets(MOCK_TUTOR_PETS);
      }
    };

    loadTutorPets();
  }, [userType]);

  useEffect(() => {
    if (userType !== 'TUTOR') {
      return;
    }

    const persistTutorPets = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_TUTOR_PETS, JSON.stringify(tutorPets));
      } catch (error) {
      }
    };

    persistTutorPets();
  }, [tutorPets, userType]);

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        portalToggle,
        setPortalToggle,
        tutorPets,
        addTutorPet,
        loginTutor,
        loginVet,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
