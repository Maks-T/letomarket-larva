// resources/js/components/Auth/Views/LoginView.jsx
import EmailPhoneInput from '../UI/EmailPhoneInput.jsx';
import CodeInput from '../UI/CodeInput.jsx';

export default function LoginView({
                                      login, setLogin, onSendCode, onVerify,
                                      onChangeView, loading, error, isCodeSent, timeLeft
                                  }) {
    return (
        <div className="space-y-6">
            <h2 className="text-[20px] font-medium text-[#F15921]">Войти или зарегистрироваться</h2>

            <EmailPhoneInput
                value={login}
                onChange={setLogin}
                error={!isCodeSent ? error : null}
                disabled={isCodeSent}
            />

            {/* Блок ввода кода появляется по аналогии с CodeConfirmGroup */}
            {isCodeSent && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <CodeInput onComplete={onVerify} error={isCodeSent ? error : null} />
                    <p className="text-[12px] text-[#424242] text-center">
                        Код отправлен. Повторить можно через {timeLeft} сек.
                    </p>
                </div>
            )}

            <div className="space-y-4 pt-2">
                <button
                    onClick={onSendCode}
                    disabled={loading || !login || (isCodeSent && timeLeft > 0)}
                    className="w-full h-[51px] bg-[#F15921] hover:bg-[#ff7340] disabled:bg-[#FDAA8C] text-white font-medium text-[18px] rounded-2xl transition-all"
                >
                    {isCodeSent ? 'Отправить повторно' : 'Получить код'}
                </button>

                {!isCodeSent && (
                    <>
                        <button
                            onClick={() => onChangeView('password')}
                            className="w-full h-[51px] border-2 border-[#3DC5FF] bg-[#F5F8FA] text-[#3DC5FF] font-medium text-[18px] rounded-2xl hover:bg-white transition-all"
                        >
                            Войти с паролем
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#B4B4B4]"></div></div>
                            <span className="relative px-3 bg-white text-[#4E4E4E] text-[20px]">или</span>
                        </div>

                        <button className="w-full h-[51px] bg-black text-white rounded-2xl flex items-center justify-center gap-3 text-[18px] font-medium">
                            <div className="w-7 h-7 bg-[#FC3F1D] rounded-full flex items-center justify-center text-[14px] font-bold">Я</div>
                            Войти через Yandex
                        </button>
                    </>
                )}
            </div>

            <p className="text-[12px] text-[#424242] text-center px-4 leading-tight">
                Нажимая кнопку "Получить код", вы соглашаетесь с <br/>
                <a href="/customer/privacy/" className="underline">политикой конфиденциальности</a>
            </p>
        </div>
    );
}
