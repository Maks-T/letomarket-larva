import React, {useState} from 'react';
import AuthCard from '../ui/AuthCard';
import EmailPhoneInput from '../ui/EmailPhoneInput';
import PasswordInput from '../ui/PasswordInput';

export default function PasswordView({
                                       login,
                                       password,
                                       setPassword,
                                       onLogin,
                                       onChangeView,
                                       error,
                                       loading
                                     }) {
  const [localLogin, setLocalLogin] = useState(login || '');
  const [isLoginValid, setIsLoginValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginValid && password) onLogin(localLogin);
  };

  return (
    <AuthCard title="Войти с паролем" onBack={() => onChangeView('login')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <EmailPhoneInput
          value={localLogin}
          onChange={(val, type, isValid) => {
            setLocalLogin(val);
            setIsLoginValid(isValid);
          }}
        />

        <div className="space-y-2">
          <PasswordInput value={password} onChange={setPassword} error={error}/>
          <button
            type="button"
            onClick={() => onChangeView('forgot')}
            className="text-[14px] text-[#F15921] underline lowercase hover:text-[#ff7340]"
          >
            Забыли свой пароль?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !password || !isLoginValid}
          className="w-full h-[51px] bg-[#F15921] text-white font-medium text-[16px] rounded-2xl hover:bg-[#ff7340] disabled:bg-[#FDAA8C] transition-all"
        >
          Войти
        </button>
      </form>
    </AuthCard>
  );
}