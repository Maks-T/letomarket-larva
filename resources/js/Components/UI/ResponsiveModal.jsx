import { useEffect } from 'react';

export default function ResponsiveModal({ isOpen, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="relative z-[60]">
            {/* Затемнение фона */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Контейнер: Центрированное окно на ПК, шторка снизу на мобильном */}
            <div className="fixed inset-0 flex items-end md:items-center justify-center pointer-events-none">
                <div className="w-full md:w-[480px] bg-white pointer-events-auto rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-all max-h-[90vh] flex flex-col">

                    {/* Кнопка закрытия */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Контент */}
                    <div className="p-6 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
