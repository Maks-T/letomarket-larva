import { useAuth } from "@/Contexts/AuthContext";
import { Link, usePage } from "@inertiajs/react";

export default function Header() {
    const { openAuth } = useAuth();
    const user = usePage().props.auth.user;

    return (
        <header className="h-20 bg-blue-200 flex items-center justify-between px-8 border-b-2 border-blue-400">
            <div className="font-bold text-blue-800 text-xl">
                <Link href="/">Letomarket</Link>
            </div>

            <a href="/admin" className="text-blue-800 hover:text-blue-600 font-medium">
                Админка
            </a>

            <div className="flex items-center gap-4">
                <span className="text-sm hidden md:inline">[ Меню | Корзина ]</span>

                {user ? (
                    <Link href="/cabinet" className="font-bold text-blue-900 hover:underline">
                        {user.first_name || 'Кабинет'}
                    </Link>
                ) : (
                    <button
                        onClick={() => openAuth('login')}
                        className="bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-blue-50 transition"
                    >
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
}
