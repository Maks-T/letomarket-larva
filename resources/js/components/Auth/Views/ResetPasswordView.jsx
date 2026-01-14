import PasswordInput from '../UI/PasswordInput.jsx';
import CodeInput from '../UI/CodeInput.jsx';
import {useState} from "react";

export default function ResetPasswordView({
                                              login, onReset, error, loading
                                          }) {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            // Лучше обработать это во внешней функции, но для простоты:
            alert('Пароли не совпадают');
            return;
        }
        onReset({ code, password: newPassword, password_confirmation: confirmPassword });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <h2 className="text-2xl font-bold text-[#F15921]">Новый пароль</h2>
            <p className="text-sm text-gray-600">Для аккаунта {login}</p>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Код из СМС/Email</label>
                <CodeInput length={6} onComplete={setCode} error={error} />
            </div>

            <PasswordInput value={newPassword} onChange={setNewPassword} />
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />

            <button
                type="submit"
                disabled={loading || !code || !newPassword}
                className="w-full bg-[#F15921] text-white font-semibold text-lg py-4 rounded-2xl hover:bg-[#d94a16] transition disabled:opacity-50"
            >
                Сохранить пароль
            </button>
        </form>
    );
}
