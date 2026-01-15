import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@inertiajs/react";
import { Search, Menu, ChevronRight, User, Phone, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {CATEGORIES, TOP_MENU_ITEMS, PHONE_NUMBER} from "@components/Header/constants.js";


export default function MobileMenuDrawer({ isOpen, onClose, user, openAuth }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Блокировка скролла
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!mounted) return null;

    // Используем Portal, чтобы меню было поверх всего сайта
    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[100] lg:hidden",
                isOpen ? "pointer-events-auto" : "pointer-events-none"
            )}
        >
            {/* Затемнение (Overlay) */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-[2px]",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Само меню (Drawer) */}
            <div className={cn(
                "absolute top-0 left-0 w-[85%] max-w-[320px] h-[100dvh] bg-gradient-to-b from-white to-[#F5F5F5] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>

                {/* 1. Хедер меню */}
                <div className="flex items-center justify-between p-5 border-b border-[#EAEAEA] bg-white shrink-0">
                    <span className="font-bold text-xl text-[#2F2F2F]">Меню</span>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-[#8A8A8A] hover:text-[#F15921] transition-colors"
                    >
                        <X size={26} />
                    </button>
                </div>

                {/* 2. Скроллируемый контент */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">

                    {/* Поиск */}
                    <form role="search" aria-label="Форма поиска">
                        <div className="flex items-center justify-between w-full h-11 px-4 rounded-full border border-[#DFDFDF] bg-[#F5F5F5] focus-within:bg-white focus-within:border-[#F15921] transition-all">
                            <input
                                type="text"
                                placeholder="Поиск..."
                                className="flex-1 bg-transparent text-sm text-[#2F2F2F] placeholder:text-[#8A8A8A] outline-none"
                            />
                            <button type="submit" className="text-[#8A8A8A] hover:text-[#F15921]">
                                <Search size={20} />
                            </button>
                        </div>
                    </form>

                    {/* Кнопка Каталог */}
                    <Link
                        href="/catalog"
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 bg-[#F15921] text-white px-6 h-12 rounded-full font-medium text-base hover:bg-[#D94916] active:scale-[0.98] transition-all shadow-md shadow-orange-200"
                    >
                        <Menu size={20} />
                        <span>Каталог товаров</span>
                    </Link>

                    {/* Главная навигация */}
                    <nav className="border-y border-[#EAEAEA] py-2">
                        {TOP_MENU_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between py-3 text-[15px] font-normal text-[#2F2F2F] hover:text-[#F15921] border-b border-transparent hover:border-gray-100 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Категории */}
                    <nav>
                        <div className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider mb-2">Категории</div>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between py-3 text-[15px] border-b border-[#EAEAEA] last:border-0",
                                    cat.highlight ? "text-[#F12020] font-medium" : "text-[#4E4E4E]"
                                )}
                            >
                                {cat.label}
                                <ChevronRight size={16} className="text-[#D1D1D1]" />
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 3. Футер меню (Контакты и Локация) */}
                <div className="p-5 border-t border-[#EAEAEA] bg-white space-y-4 shrink-0 pb-8">
                    {/* Кнопка входа */}
                    {!user ? (
                        <button
                            onClick={() => { onClose(); openAuth('login'); }}
                            className="w-full flex items-center justify-center gap-2 h-11 border-2 border-[#EAEAEA] rounded-xl font-medium text-[#2F2F2F] hover:border-[#F15921] hover:text-[#F15921] transition-all"
                        >
                            <User size={18} />
                            Войти в кабинет
                        </button>
                    ) : (
                        <Link
                            href="/cabinet"
                            onClick={onClose}
                            className="flex items-center gap-3 bg-[#F7F7F7] p-3 rounded-xl"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#F15921] shadow-sm">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{user.first_name || 'Профиль'}</div>
                                <div className="text-xs text-gray-500">Перейти в кабинет</div>
                            </div>
                        </Link>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                        <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 text-[#2F2F2F] font-semibold text-lg">
                            <Phone size={18} className="text-[#F15921]" />
                            {PHONE_NUMBER}
                        </a>
                        <div className="flex items-center gap-2 text-[#5D5D5D] text-sm">
                            <MapPin size={18} className="text-[#8A8A8A]" />
                            <span>г. Кемерово</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
