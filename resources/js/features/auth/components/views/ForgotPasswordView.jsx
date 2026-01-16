import React, {useState} from 'react';
import AuthCard from '../ui/AuthCard';
import EmailPhoneInput from '../ui/EmailPhoneInput';
import CodeTimerInput from '../ui/CodeTimerInput';

export default function ForgotPasswordView({
                                             login,
                                             setLogin,
                                             isCodeSent,
                                             onSendResetCode,
                                             onVerify,
                                             onChangeView,
                                             loading,
                                             error
                                           }) {
  const [isContactValid, setIsContactValid] = useState(false);

  // Обертка, чтобы кнопка не срабатывала, если контакт не валиден (дополнительная защита)
  const handleSendClick = () => {
    if (isContactValid) onSendResetCode();
  };

  return (
    <AuthCard title="Восстановление" onBack={() => onChangeView('password')}>
      <div className="space-y-6">
        <p className="text-[14px] text-[#4E4E4E]">
          Введите телефон или Email, чтобы получить код для сброса пароля.
        </p>

        <EmailPhoneInput
          value={login}
          onChange={(val, type, isValid) => {
            setLogin(val);
            setIsContactValid(isValid);
          }}
        />

        <CodeTimerInput
          onSendCode={handleSendClick}
          onComplete={onVerify}
          isCodeSent={isCodeSent}

          isLoading={loading}
          disabled={!isContactValid}
          error={isCodeSent ? error : null}
        />
      </div>
    </AuthCard>
  );
}