import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TUTOR_PETS, MOCK_TUTOR_REMINDERS } from '../data/fidelisData';
import { useAuthSession } from '../hooks/useAuthSession';

export const UserContext = createContext();

const STORAGE_KEY_TUTOR_PETS = '@fidelis:tutor_pets';

const buildRemindersStorageKey = (userType, tutorId) =>
  `@fidelis:reminders:${userType ?? 'TUTOR'}:${tutorId ? `tutor-${tutorId}` : 'guest'}`;

const withParsedDates = (reminders) =>
  reminders.map((reminder) => ({ ...reminder, dueDate: new Date(reminder.dueDate) }));

export const UserProvider = ({ children }) => {
  const { session, status, sessionError, startSession, logout } = useAuthSession();
  const user = useMemo(() => session ? { id: session.tutorId, name: session.nome } : null, [session]);
  const userType = session ? 'TUTOR' : null;
  const [portalToggle, setPortalToggle] = useState('TUTOR');
  const [tutorPets, setTutorPets] = useState(MOCK_TUTOR_PETS);
  const [tutorReminders, setTutorReminders] = useState(MOCK_TUTOR_REMINDERS);

  const remindersStorageKey = useMemo(
    () => buildRemindersStorageKey(userType, user?.id),
    [userType, user?.id]
  );

  const petsHydrated = useRef(false);
  const hydratedRemindersKey = useRef(null);

  useEffect(() => {
    if (user) return;
    setPortalToggle('TUTOR');
    petsHydrated.current = false;
    hydratedRemindersKey.current = null;
    setTutorPets(MOCK_TUTOR_PETS);
    setTutorReminders(MOCK_TUTOR_REMINDERS);
  }, [user]);

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
    petsHydrated.current = false;

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
  }, [userType, user?.id]);

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
        session,
        authStatus: status,
        sessionError,
        startSession,
        portalToggle,
        setPortalToggle,
        tutorPets,
        addTutorPet,
        tutorReminders,
        addTutorReminder,
        updateTutorReminder,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
