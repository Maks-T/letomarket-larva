import React, { useEffect } from "react";
import CodeInput from "./CodeInput";
import ErrorMessage from "./ErrorMessage";
import AuthButton from "./AuthButton";
import { useTimer } from "@/hooks/use-timer.js";

export default function CodeTimerInput({
                                         onComplete,
                                         onSendCode,
                                         isCodeSent,
                                         isLoading,
                                         error,
                                         disabled = false
                                       }) {
  const { seconds, isActive, start, formattedTime } = useTimer(59);

  useEffect(() => {
    if (isCodeSent && !isActive) {
      start();
    }
  }, [isCodeSent]);

  const handleButtonClick = () => {
    onSendCode();

    // Если это повторная отправка
    if (isCodeSent && !isActive) {
      start();
    }
  };

  const isLocked = (isCodeSent && isActive) || disabled;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <CodeInput
          length={6}
          onComplete={onComplete}
          error={error}
          disabled={!isCodeSent}
        />

        <ErrorMessage message={error} variant="box" />
      </div>

      <AuthButton
        onClick={handleButtonClick}
        loading={isLoading}
        disabled={isLocked}
      >
        {!isCodeSent ? "Получить код" : "Отправить повторно"}
      </AuthButton>

      {isCodeSent && isActive && (
        <div className="text-xs text-[#424242] text-center -mt-2">
          <p>Код был отправлен</p>
          <p>Повторить попытку можно будет через <b>{formattedTime}</b> сек.</p>
        </div>
      )}

      <div className="text-[12px] text-[#424242] text-center px-2 leading-tight">
        Нажимая кнопку “Получить код” вы соглашаетесь с{" "}
        <a href="/customer/privacy/" className="underline hover:text-[#F15921]" target="_blank">
          политикой конфиденциальности
        </a>
      </div>
    </div>
  );
}