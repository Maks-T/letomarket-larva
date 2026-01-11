import { useState, useEffect } from 'react';

const MODE = { EMAIL: 'email', PHONE: 'phone' };

export default function EmailPhoneInput({ value, onChange, onTypeChange, error }) {
    const [mode, setMode] = useState(MODE.EMAIL);

    // --- ЛОГИКА МАСКИ (из старого проекта) ---
    const getDigits = (val) => val.replace(/^\+7/, '').replace(/\D+/g, '');

    const formatNumber = (val) => {
        let digits = getDigits(val);
        // Ограничиваем 10 цифрами (без +7)
        if (digits.length > 10) digits = digits.substring(0, 10);

        let formatted = '+7';
        if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
        if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
        if (digits.length >= 7) formatted += ' ' + digits.substring(6, 8);
        if (digits.length >= 9) formatted += ' ' + digits.substring(8, 10);
        return formatted;
    };

    const handleInput = (e) => {
        let val = e.target.value;
        let newMode = mode;

        // Если ввод начинается с цифр или + - это телефон
        if (/^[+\d]/.test(val)) {
            newMode = MODE.PHONE;
        }
        // Если появились буквы или @ - это email
        else if (/[a-zA-Z@]/.test(val)) {
            newMode = MODE.EMAIL;
        }

        // Если режим сменился или мы в режиме телефона - форматируем
        if (newMode === MODE.PHONE) {
            // Удаляем старую маску при вводе
            if (val.length < value.length) {
                // Обработка Backspace (упрощенная)
                // Если стираем, просто даем браузеру стереть, потом форматируем
            } else {
                val = formatNumber(val);
            }

            // Если юзер стер всё до +7, очищаем
            if (val === '+7') val = '';
        }

        setMode(newMode);
        onTypeChange && onTypeChange(newMode);
        onChange(val);
    };

    // Обработка стирания (Backspace) для маски
    const handleKeyDown = (e) => {
        if (mode === MODE.PHONE && e.key === 'Backspace' && value.length > 0) {
            // Получаем только цифры
            let digits = getDigits(value);
            // Удаляем последнюю
            digits = digits.slice(0, -1);
            // Форматируем заново
            const newVal = digits.length > 0 ? formatNumber(digits) : '';
            e.preventDefault();
            onChange(newVal);
        }
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                Телефон или Email
            </label>
            <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors text-lg ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-gray-400'
                }`}
                placeholder="+7 (999) 000-00-00"
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                autoFocus
            />

            {/* Подсказка (как в старом проекте) */}
            {value.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                    {mode === MODE.PHONE
                        ? '* Код подтверждения придёт в Telegram или SMS'
                        : '* Код подтверждения придёт на Email'}
                </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
