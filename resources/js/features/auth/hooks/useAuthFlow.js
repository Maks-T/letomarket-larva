import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authApi } from '../api/auth';

export const VIEW = {
  LOGIN: 'login',
  PASSWORD: 'password',
  FORGOT: 'forgot',
  RESET: 'reset',
  SUCCESS: 'success',
};

export function useAuthFlow(isOpen) {
  // Состояния
  const [view, setView] = useState(VIEW.LOGIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmedCode, setConfirmedCode] = useState('');

  // Данные
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('/');

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setView(VIEW.LOGIN);
    setError(null);
    setIsCodeSent(false);
    setLoading(false);
    setPassword('');
    // Login не сбрасываем, часто удобно, если он остается
  };

  const changeView = useCallback((newView) => {
    setError(null);
    setIsCodeSent(false);
    setView(newView);
  }, []);

  // --- API Handlers ---

  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.sendCode(login);
      setIsCodeSent(true);
      toast.success('Код отправлен');
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      setError(validationErrors ? Object.values(validationErrors)[0][0] : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.verifyCode(login, code);

      if (view === VIEW.FORGOT) {
        setConfirmedCode(code);
        changeView(VIEW.RESET);
      } else {
        setRedirectUrl(data.redirect || '/');
        setView(VIEW.SUCCESS);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (actualLogin) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.loginPassword(actualLogin || login, password);
      setRedirectUrl(data.redirect || '/');
      setView(VIEW.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (resetData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.resetPassword({ login, ...resetData });
      setRedirectUrl(data.redirect || '/');
      setView(VIEW.SUCCESS);
      toast.success('Пароль успешно изменен');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    view,
    loading,
    error,
    isCodeSent,
    login,
    password,
    redirectUrl,
    code: confirmedCode,

    // Setters
    setLogin,
    setPassword,

    // Actions
    changeView,
    sendOtp,
    verifyOtp,
    loginWithPassword,
    submitNewPassword
  };
}