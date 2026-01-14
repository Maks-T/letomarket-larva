import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const CONTACT_TYPE = {
    EMAIL: 'email',
    PHONE: 'phone',
};

const MODE = CONTACT_TYPE;

const getDigits = (value) => value.replace(/^\+7/, '').replace(/\D+/g, '');

const formatNumber = (value, mask, symbolMask) => {
    value = getDigits(value);
    const indexesSymbol = [];
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === symbolMask) indexesSymbol.push(i);
    }
    const partMask = mask.slice(0, indexesSymbol[value.length]);
    let formatted = '';
    let iValue = 0;
    for (let i = 0; i < partMask.length; i++) {
        let char = partMask[i];
        if (char === symbolMask) {
            char = value[iValue];
            iValue += 1;
        }
        formatted += char;
    }
    return formatted;
};

const isEmail = (value) => /.+@.+\..{2,5}$/.test(value);
const isHasAttrsEmail = (value) => {
    const valWithoutPrefix = value.replace(/^\+7/, '');
    return /[a-zA-Zа-яА-Я._%+\-@]/.test(valWithoutPrefix);
};

export default function EmailPhoneInput({
                                            mask = '+7 (###) ### ## ##',
                                            symbolMask = '#',
                                            value = '', // Принимаем значение из вне
                                            onChange,    // Функция для обновления (setLogin)
                                            onTypeChange,
                                            isShowNotice = true,
                                            disabled = false,
                                            error = ''
                                        }) {
    const [localValue, setLocalValue] = useState(value);
    const [mode, setMode] = useState(MODE.EMAIL);
    const [localError, setLocalError] = useState('');
    const isFirstRender = useRef(true);

    const handleInput = (e) => {
        let inputVal = e.target.value;
        let flagMode = '';

        if (inputVal === '+' || inputVal === '7' || inputVal === '8') {
            flagMode = MODE.PHONE;
            inputVal = '';
        } else if (inputVal === '9') {
            flagMode = MODE.PHONE;
            inputVal = '9';
        } else {
            if (isHasAttrsEmail(inputVal)) {
                flagMode = MODE.EMAIL;
                if (mode === MODE.PHONE) {
                    const digits = getDigits(inputVal);
                    const onlyLetters = inputVal.replace(/[0-9\s()+7-]/g, '');
                    inputVal = digits + onlyLetters;
                }
            } else {
                flagMode = inputVal === '' ? MODE.EMAIL : MODE.PHONE;
            }
        }

        if (flagMode === MODE.PHONE) {
            inputVal = formatNumber(inputVal, mask, symbolMask);
        }

        setLocalValue(inputVal);
        setMode(flagMode);

        // Срочное обновление родителя, чтобы кнопка реагировала быстрее
        // Но полную валидацию оставим в useEffect
        if (inputVal === '') {
            onChange('');
        }
    };

    const handleKeyDown = (e) => {
        if (mode === MODE.PHONE && e.key === 'Backspace') {
            e.preventDefault();
            let digits = getDigits(localValue);
            if (digits.length > 0) {
                digits = digits.slice(0, -1);
                setLocalValue(digits ? formatNumber(digits, mask, symbolMask) : '');
            }
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            if (!localValue) {
                setLocalError('заполните поле');
                onChange('');
                return;
            }

            let isValid = false;
            if (mode === MODE.EMAIL) {
                isValid = isEmail(localValue);
            } else {
                isValid = getDigits(localValue).length === 10;
            }

            if (isValid) {
                setLocalError('');
                onChange(localValue); // Передаем значение в LoginView
                if (onTypeChange) onTypeChange(mode);
            } else {
                setLocalError('Неверный формат');
                onChange(''); // Обнуляем в родителе, чтобы заблокировать кнопку
            }
        }, 400); // Уменьшил задержку до 400мс

        return () => clearTimeout(timer);
    }, [localValue]);

    const displayError = error || localError;

    return (
        <div className="flex flex-col gap-2.5">
            <Label className="text-[16px] font-medium text-[#4E4E4E] pl-1">
                Телефон или Email
            </Label>

            <input
                type="text"
                value={localValue}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                disabled={disabled}
                placeholder="+7 (922) 111 05 00"
                autoComplete="off"
                className={cn(
                    "h-[51px] w-full rounded-2xl bg-[#EBEBEB] px-5 outline-none text-[16px] text-[#2F2F2F] transition-all border border-transparent",
                    "focus:border-[#424242] focus:bg-white focus:ring-0",
                    displayError && localValue !== '' && "border-[#CA2D2D] bg-[#FFE7E7]"
                )}
            />

            {displayError && localValue !== '' && (
                <div className="bg-[#FFE7E7] text-[#CA2D2D] text-[14px] italic px-3 py-1.5 rounded-lg border border-[#CA2D2D]/10">
                    {displayError}
                </div>
            )}

            {isShowNotice && localValue && !displayError && (
                <div className="text-[12px] text-[#424242] leading-tight pl-1">
                    {mode === MODE.PHONE
                        ? '* Код подтверждения придёт в Telegram или в SMS'
                        : '* Код подтверждения придёт на указанный Email'}
                </div>
            )}
        </div>
    );
}
