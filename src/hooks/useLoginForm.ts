import { useRef, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useLogin, getLoginErrorMessage } from './useLogin';
import { loginRequest, validateLoginFields } from '../utils/loginForm';
import type { PortalType } from '../models/auth';

interface LoginFeedback { title: string; message: string }

export function useLoginForm() {
  const { portalToggle, setPortalToggle, sessionError, logout } = useUserContext();
  const mutation = useLogin();
  const submitting = useRef(false);
  const [portalType, setPortalType] = useState<PortalType>(portalToggle ?? 'TUTOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const { isEmailValid, isPasswordValid } = validateLoginFields(email, password);
  const errors = {
    email: touched.email && !isEmailValid ? 'Informe um email válido.' : null,
    password: touched.password && !isPasswordValid ? 'A senha deve ter ao menos 6 caracteres.' : null,
  };

  const selectPortal = (portal: PortalType) => {
    if (submitting.current || mutation.isPending) return;
    setPortalType(portal);
    setPortalToggle(portal);
  };

  const submit = async (): Promise<LoginFeedback | null> => {
    if (submitting.current || mutation.isPending) return null;
    setPortalToggle(portalType);
    setTouched({ email: true, password: true });
    if (!isEmailValid || !isPasswordValid) {
      return { title: 'Campos inválidos', message: 'Informe email e senha válidos para entrar.' };
    }
    submitting.current = true;
    try {
      await mutation.mutateAsync(loginRequest(email, password, portalType));
      setPassword('');
      return null;
    } catch (error) {
      return { title: 'Não foi possível entrar', message: getLoginErrorMessage(error) };
    } finally { submitting.current = false; }
  };

  return {
    portalType, selectPortal, email, setEmail, password, setPassword,
    touched, errors, isEmailValid, isPasswordValid,
    handleBlur: (field: keyof typeof touched) => setTouched(current => ({ ...current, [field]: true })),
    submit, isPending: mutation.isPending,
    errorMessage: mutation.error ? getLoginErrorMessage(mutation.error) : null,
    sessionError,
    clearSession: async () => { if (!submitting.current && !mutation.isPending) await logout(); },
  };
}
