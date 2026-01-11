import { useState, useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import ResponsiveModal from '@/Components/UI/ResponsiveModal';
import EmailPhoneInput from './EmailPhoneInput';
import CodeInput from './CodeInput';
import PasswordInput from './PasswordInput';
import axios from 'axios';

const VIEW = {
    LOGIN: 'login',
    CODE: 'code',
    PASSWORD: 'password',
};

export default function AuthModal() {
    const { isOpen, closeAuth } = useAuth();

    const [view, setView] = useState(VIEW.LOGIN);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [login, setLogin] = useState('');
    const [contactType, setContactType] = useState('email');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setView(VIEW.LOGIN);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    const sendCode = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(route('auth.send-code'), { login });
            setView(VIEW.CODE);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка отправки кода');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (code) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(route('auth.verify'), { login, code });
            if (res.data.status === 'ok') {
                window.location.href = res.data.redirect;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Неверный код');
            setLoading(false);
        }
    };

    const loginWithPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(route('auth.login-password'), { login, password });
            if (res.data.status === 'ok') {
                window.location.href = res.data.redirect;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
            setLoading(false);
        }
    };

    const renderLoginView = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-amber-500">Вход или регистрация</h2>
                <p className="text-gray-500 text-sm">Мы отправим код подтверждения</p>
            </div>

            <EmailPhoneInput
                value={login}
                onChange={setLogin}
                onTypeChange={setContactType}
                error={error}
            />

            <button
                onClick={sendCode}
                disabled={loading || login.length < 5}
                className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
            >
                {loading ? 'Отправка...' : 'Получить код'}
            </button>

            <div className="text-center">
                <button
                    onClick={() => setView(VIEW.PASSWORD)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    Войти с паролем
                </button>
            </div>
        </div>
    );

    const renderCodeView = () => (
        <div className="space-y-6">
            <button onClick={() => setView(VIEW.LOGIN)} className="text-sm text-gray-500">← Назад</button>
            <h2 className="text-xl font-bold text-center">Введите код</h2>

            <CodeInput length={6} onComplete={verifyCode} error={error} />

            {loading && <p className="text-center text-sm">Проверка...</p>}
        </div>
    );

    const renderPasswordView = () => (
        <form onSubmit={loginWithPassword} className="space-y-6">
            <button type="button" onClick={() => setView(VIEW.LOGIN)} className="text-sm text-gray-500">← Назад</button>
            <h2 className="text-xl font-bold text-center">Вход по паролю</h2>

            <EmailPhoneInput value={login} onChange={setLogin} />
            <PasswordInput value={password} onChange={setPassword} error={error} />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl"
            >
                {loading ? 'Вход...' : 'Войти'}
            </button>
        </form>
    );

    return (
        <ResponsiveModal isOpen={isOpen} onClose={closeAuth}>
            {view === VIEW.LOGIN && renderLoginView()}
            {view === VIEW.CODE && renderCodeView()}
            {view === VIEW.PASSWORD && renderPasswordView()}
        </ResponsiveModal>
    );
}
