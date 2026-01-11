import { useState } from 'react';

export default function PasswordInput({ value, onChange, error }) {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                        error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-gray-400'
                    }`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? 'Скрыть' : 'Показать'}
                </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
