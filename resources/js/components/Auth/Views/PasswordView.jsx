import EmailPhoneInput from '../UI/EmailPhoneInput.jsx';
import PasswordInput from '../UI/PasswordInput.jsx';

export default function PasswordView({ login, password, setPassword, onLogin, onChangeView, error, loading }) {
    return (
        <form onSubmit={onLogin} className="space-y-6">
            <div className="flex items-center gap-2">
                <button type="button" onClick={() => onChangeView('login')} className="p-2 -ml-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10.3 17.1L3.3 12.8C3.1 12.6 3 12.3 3 12C3 11.7 3.1 11.4 3.3 11.2L8.8 5.3" stroke="#8A8A8A" strokeWidth="2"/></svg>
                </button>
                <h2 className="text-[20px] font-medium text-[#F15921]">Войти с паролем</h2>
            </div>

            <EmailPhoneInput value={login} disabled isShowNotice={false} />

            <div className="space-y-2">
                <PasswordInput value={password} onChange={setPassword} error={error} />
                <button
                    type="button"
                    onClick={() => onChangeView('forgot')}
                    className="text-[14px] text-[#F15921] underline lowercase"
                >
                    Забыли свой пароль?
                </button>
            </div>

            <button
                type="submit"
                disabled={loading || !password}
                className="w-full h-[51px] bg-[#F15921] text-white font-medium text-[18px] rounded-2xl hover:bg-[#ff7340] transition-all"
            >
                Войти
            </button>
        </form>
    );
}
