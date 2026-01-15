import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { LogOut, User, Wallet, Phone, Mail } from 'lucide-react';

export default function Profile() {
    // Получаем пользователя из глобальных пропсов (HandleInertiaRequests)
    const { user } = usePage().props.auth;

    // Функция выхода
    const handleLogout = () => {
        router.post(route('logout')); // Отправляем POST запрос на /logout
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Head title="Личный кабинет" />

            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#1b1b18]">Личный кабинет</h1>
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                >
                    <LogOut size={18} />
                    Выйти
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Карточка пользователя */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-16 h-16 bg-[#F15921]/10 rounded-full flex items-center justify-center text-[#F15921]">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-gray-500 text-sm">Клиент</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">Телефон</p>
                                <p className="font-medium">
                                    {user.phone || 'Не указан'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="font-medium">
                                    {user.email || 'Не указан'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Бонусная карта */}
                <div className="bg-gradient-to-r from-[#F15921] to-[#ff8c61] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Wallet size={20} />
                            <span className="font-medium">Бонусный баланс</span>
                        </div>
                        <div className="text-4xl font-bold">
                            {Number(user.loyalty_balance).toLocaleString('ru-RU')} ₽
                        </div>
                        <p className="mt-4 text-sm opacity-80">
                            Используйте баллы для оплаты до 30% стоимости заказа
                        </p>
                    </div>

                    {/* Декор фона */}
                    <div className="absolute right-[-20px] bottom-[-40px] opacity-20">
                        <Wallet size={150} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Подключаем Layout
Profile.layout = page => <MainLayout children={page} />;
