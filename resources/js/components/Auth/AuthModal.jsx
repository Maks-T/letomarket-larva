import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/Contexts/AuthContext';

// Импорт обновленных Views
import LoginView from './Views/LoginView';
import PasswordView from './Views/PasswordView';
import ForgotPasswordView from './Views/ForgotPasswordView';
import ResetPasswordView from './Views/ResetPasswordView';
import SuccessView from './Views/SuccessView';

import ResponsiveModal from "@components/ui/ResponsiveModal.jsx";

const VIEW = {
    LOGIN: 'login',      // Ввод телефона + Код (если отправлен)
    PASSWORD: 'password',
    FORGOT: 'forgot',    // Ввод телефона + Код (если отправлен)
    RESET: 'reset',      // Установка нового пароля
    SUCCESS: 'success',
};

/**
 * Обертка вынесена наружу для сохранения фокуса в инпутах
 */
const ContentWrapper = ({ children }) => (
    <div className="p-8 md:p-10 h-full flex flex-col justify-center min-h-[460px] bg-white relative overflow-hidden rounded-[16px]">
        {children}
    </div>
);

export default function AuthModal() {
    const { isOpen, closeAuth } = useAuth();

    // Системные состояния
    const [view, setView] = useState(VIEW.LOGIN);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCodeSent, setIsCodeSent] = useState(false); // Ключевое состояние для "Битрикс-логики"

    // Данные пользователя
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('/');

    // Смена экрана с очисткой ошибок и сбросом состояния кода
    const changeView = useCallback((newView) => {
        setError(null);
        setIsCodeSent(false); // При переходе между вьюхами сбрасываем статус отправки кода
        setView(newView);
    }, []);

    // Сброс при открытии модалки
    useEffect(() => {
        if (isOpen) {
            setView(VIEW.LOGIN);
            setError(null);
            setIsCodeSent(false);
            setLoading(false);
            setPassword('');
        }
    }, [isOpen]);

    // Таймер для повторной отправки
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleAuthSuccess = (url) => {
        setRedirectUrl(url || '/');
        setView(VIEW.SUCCESS);
    };

    // --- ACTIONS ---

    // 1. Отправка кода (используется и в Login, и в Forgot Password)
    const sendOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(window.route('auth.send-code'), { login });
            setTimeLeft(60);
            setIsCodeSent(true); // Показываем ячейки кода на текущем экране
            toast.success('Код отправлен');
        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            setError(validationErrors ? Object.values(validationErrors)[0][0] : 'Ошибка отправки');
        } finally {
            setLoading(false);
        }
    };

    // 2. Проверка кода
    const verifyOtp = async (code) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(window.route('auth.verify'), { login, code });
            if (res.data.status === 'ok') {
                if (view === VIEW.FORGOT) {
                    changeView(VIEW.RESET); // Если восстанавливаем — идем менять пароль
                } else {
                    handleAuthSuccess(res.data.redirect); // Если входим — успех
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Неверный код');
        } finally {
            setLoading(false);
        }
    };

    // 3. Вход по паролю
    const loginWithPassword = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(window.route('auth.login-password'), { login, password });
            if (res.data.status === 'ok') handleAuthSuccess(res.data.redirect);
        } catch (err) {
            setError('Неверный пароль');
        } finally {
            setLoading(false);
        }
    };

    // 4. Сброс пароля
    const submitNewPassword = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(window.route('auth.reset-password'), { login, ...data });
            if (res.data.status === 'ok') handleAuthSuccess(res.data.redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка сохранения');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (view) {
            case VIEW.LOGIN:
                return (
                    <LoginView
                        login={login}
                        setLogin={setLogin}
                        isCodeSent={isCodeSent}
                        onSendCode={sendOtp}
                        onVerify={verifyOtp}
                        timeLeft={timeLeft}
                        onChangeView={changeView}
                        error={error}
                        loading={loading}
                    />
                );
            case VIEW.PASSWORD:
                return (
                    <PasswordView
                        login={login}
                        password={password}
                        setPassword={setPassword}
                        onLogin={loginWithPassword}
                        onChangeView={changeView}
                        error={error}
                        loading={loading}
                    />
                );
            case VIEW.FORGOT:
                return (
                    <ForgotPasswordView
                        login={login}
                        setLogin={setLogin}
                        isCodeSent={isCodeSent}
                        onSendResetCode={sendOtp}
                        onVerify={verifyOtp}
                        onChangeView={changeView}
                        error={error}
                        loading={loading}
                    />
                );
            case VIEW.RESET:
                return (
                    <ResetPasswordView
                        onReset={submitNewPassword}
                        error={error}
                        loading={loading}
                    />
                );
            case VIEW.SUCCESS:
                return <SuccessView redirectUrl={redirectUrl} />;
            default:
                return null;
        }
    };

    return (
        <ResponsiveModal isOpen={isOpen} onClose={closeAuth} title="Вход в аккаунт">
            <ContentWrapper>
                {renderContent()}
            </ContentWrapper>
        </ResponsiveModal>
    );
}
