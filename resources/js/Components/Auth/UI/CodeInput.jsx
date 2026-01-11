import { useState, useRef, useEffect } from 'react';

export default function CodeInput({ length = 6, onComplete, error }) {
    const [code, setCode] = useState(Array(length).fill(''));
    const inputsRef = useRef([]);

    // Автофокус на первый элемент
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return; // Только цифры

        const newCode = [...code];
        newCode[index] = val.slice(-1); // Берем только последний символ
        setCode(newCode);

        // Переключаем фокус вперед
        if (val && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }

        // Если заполнили всё - отдаем родителю
        if (newCode.every((c) => c !== '') && index === length - 1) {
            onComplete(newCode.join(''));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // Если поле пустое и жмем Backspace - идем назад
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newCode = pastedData.split('');
            // Дополняем пустыми, если вставили меньше
            while (newCode.length < length) newCode.push('');

            setCode(newCode);
            onComplete(pastedData);
            // Фокус на последнее заполненное
            inputsRef.current[Math.min(pastedData.length, length - 1)]?.focus();
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Введите код подтверждения
            </label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`w-10 h-12 md:w-12 md:h-14 text-center text-2xl font-bold border rounded-lg outline-none transition-all ${
                            error
                                ? 'border-red-500 bg-red-50 text-red-500'
                                : 'border-gray-200 bg-gray-50 focus:border-amber-500 focus:bg-white'
                        }`}
                    />
                ))}
            </div>
            {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
        </div>
    );
}
