import React, {useState} from 'react';
import AuthCard from '../ui/AuthCard';
import EmailPhoneInput from '../ui/EmailPhoneInput';
import CodeTimerInput from '../ui/CodeTimerInput';
import YandexButton from '../ui/YandexButton';
import {toast} from "sonner";
import AuthButton from "../ui/AuthButton.jsx";

export default function LoginView({
                                    login,
                                    setLogin,
                                    isCodeSent,
                                    onSendCode,
                                    onVerify,
                                    onChangeView,
                                    error,
                                    loading
                                  }) {
  const [isContactValid, setIsContactValid] = useState(false);

  const handleSendClick = () => {
    if (isContactValid) {
      onSendCode();
    }
  };

  return (
    <AuthCard title="Войти или зарегистрироваться">
      <div className="space-y-6">

        <EmailPhoneInput
          value={login}
          onChange={(val, type, isValid) => {
            setLogin(val);
            setIsContactValid(isValid);
          }}

          disabled={isCodeSent}
        />

        <CodeTimerInput
          onSendCode={handleSendClick}
          onComplete={onVerify}
          isCodeSent={isCodeSent}
          isLoading={loading}
          error={isCodeSent ? error : null}
        />


        {!isCodeSent && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1">
            <AuthButton
              variant="secondary"
              onClick={() => onChangeView('password')}
            >
              Войти с паролем
            </AuthButton>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#B4B4B4]"></div>
              </div>
              <span className="relative px-3 bg-white text-[#4E4E4E] text-[16px]">
                                или
                            </span>
            </div>

            <YandexButton onClick={() => toast.warning('Функция авторизации Yandex пока не доступна')}/>
          </div>
        )}
      </div>
    </AuthCard>
  );
}