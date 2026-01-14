// resources/js/components/Auth/Views/ForgotPasswordView.jsx
import EmailPhoneInput from '../UI/EmailPhoneInput.jsx';
import CodeInput from '../UI/CodeInput.jsx';

export default function ForgotPasswordView({
                                               login, setLogin, onSendResetCode, onVerify,
                                               onChangeView, loading, error, isCodeSent
                                           }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <button onClick={() => onChangeView('password')} className="p-2 -ml-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10.3 17.1L3.3 12.8C3.1 12.6 3 12.3 3 12C3 11.7 3.1 11.4 3.3 11.2L8.8 5.3" stroke="#8A8A8A" strokeWidth="2"/></svg>
                </button>
                <h2 className="text-[20px] font-medium text-[#F15921]">Восстановление</h2>
            </div>

            <p className="text-[14px] text-[#4E4E4E]">Введите телефон или Email, чтобы получить код для сброса пароля.</p>

            <EmailPhoneInput value={login} onChange={setLogin} disabled={isCodeSent} />

            {isCodeSent && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <CodeInput onComplete={onVerify} error={error} />
                </div>
            )}

            <button
                onClick={onSendResetCode}
                disabled={loading || !login}
                className="w-full h-[51px] bg-[#F15921] text-white font-medium text-[18px] rounded-2xl hover:bg-[#ff7340] transition-all"
            >
                {isCodeSent ? 'Отправить код повторно' : 'Получить код'}
            </button>
        </div>
    );
}
