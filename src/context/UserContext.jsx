import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TUTOR_PETS, MOCK_TUTOR_REMINDERS } from '../data/fidelisData';

export const UserContext = createContext();

const STORAGE_KEY_TUTOR_PETS = '@fidelis:tutor_pets';

const buildRemindersStorageKey = (userType, email) =>
  `@fidelis:reminders:${userType ?? 'TUTOR'}:${email ?? 'guest'}`;

const withParsedDates = (reminders) =>
  reminders.map((reminder) => ({ ...reminder, dueDate: new Date(reminder.dueDate) }));

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [portalToggle, setPortalToggle] = useState('TUTOR');
  const [tutorPets, setTutorPets] = useState(MOCK_TUTOR_PETS);
  const [tutorReminders, setTutorReminders] = useState(MOCK_TUTOR_REMINDERS);

  const remindersStorageKey = useMemo(
    () => buildRemindersStorageKey(userType, user?.email),
    [userType, user?.email]
  );

  const petsHydrated = useRef(false);
  const hydratedRemindersKey = useRef(null);

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
    petsHydrated.current = false;
    hydratedRemindersKey.current = null;
    setTutorPets(MOCK_TUTOR_PETS);
    setTutorReminders(MOCK_TUTOR_REMINDERS);
  };

  const addTutorPet = (petData) => {
    setTutorPets((current) => [petData, ...current]);
  };

  const addTutorReminder = (reminderData) => {
    setTutorReminders((current) => [
      { ...reminderData, dueDate: new Date(reminderData.dueDate) },
      ...current,
    ]);
  };

  const updateTutorReminder = (reminderId, updates) => {
    setTutorReminders((current) =>
      current.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, ...updates } : reminder
      )
    );
  };

  useEffect(() => {
    if (userType !== 'TUTOR') {
      return undefined;
    }

    let active = true;

    const loadTutorPets = async () => {
      try {
        const savedPets = await AsyncStorage.getItem(STORAGE_KEY_TUTOR_PETS);
        const parsedPets = savedPets ? JSON.parse(savedPets) : null;
        if (!active) return;
        setTutorPets(Array.isArray(parsedPets) ? parsedPets : MOCK_TUTOR_PETS);
      } catch (error) {
        console.warn('[Fidelis] Nao foi possivel carregar os pets salvos:', error);
        if (active) setTutorPets(MOCK_TUTOR_PETS);
      } finally {
        if (active) petsHydrated.current = true;
      }
    };

    loadTutorPets();

    return () => {
      active = false;
    };
  }, [userType]);

  useEffect(() => {
    if (userType !== 'TUTOR' || !petsHydrated.current) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY_TUTOR_PETS, JSON.stringify(tutorPets)).catch((error) =>
      console.warn('[Fidelis] Nao foi possivel salvar os pets:', error)
    );
  }, [tutorPets, userType]);

  useEffect(() => {
    let active = true;

    const loadReminders = async () => {
      try {
        const saved = await AsyncStorage.getItem(remindersStorageKey);
        const parsed = saved ? JSON.parse(saved) : null;
        if (!active) return;
        setTutorReminders(Array.isArray(parsed) ? withParsedDates(parsed) : MOCK_TUTOR_REMINDERS);
      } catch (error) {
        console.warn('[Fidelis] Nao foi possivel carregar os lembretes:', error);
        if (active) setTutorReminders(MOCK_TUTOR_REMINDERS);
      } finally {
        if (active) hydratedRemindersKey.current = remindersStorageKey;
      }
    };

    loadReminders();

    return () => {
      active = false;
    };
  }, [remindersStorageKey]);

  useEffect(() => {
    if (hydratedRemindersKey.current !== remindersStorageKey) {
      return;
    }

    AsyncStorage.setItem(remindersStorageKey, JSON.stringify(tutorReminders)).catch((error) =>
      console.warn('[Fidelis] Nao foi possivel salvar os lembretes:', error)
    );
  }, [tutorReminders, remindersStorageKey]);

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        portalToggle,
        setPortalToggle,
        tutorPets,
        addTutorPet,
        tutorReminders,
        addTutorReminder,
        updateTutorReminder,
        loginTutor,
        loginVet,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
