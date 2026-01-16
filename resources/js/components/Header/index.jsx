import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { useAuth } from "@/features/auth";
import TopBar from "./Desktop/TopBar";
import MainHeaderRow from "./Desktop/MainHeaderRow";
import CategoryBar from "./Desktop/CategoryBar";
import MobileHeaderBar from "./Mobile/MobileHeaderBar";
import MobileMenuDrawer from "./Mobile/MobileMenuDrawer";

export default function Header() {
    const { openAuth } = useAuth();
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Получение текущего пути для подсветки активных ссылок
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <header
            className="w-full font-sans relative z-30 sticky top-0 backdrop-blur-md"
            style={{
                background: 'rgba(245, 243, 240, 0.94)',
                boxShadow: '0 1px 6px 0 rgba(35, 35, 35, 0.14)'
            }}
        >
            {/* Десктопные компоненты */}
            <TopBar currentPath={currentPath} />
            <MainHeaderRow user={user} openAuth={openAuth} />
            <CategoryBar currentPath={currentPath} />

            {/* Мобильные компоненты */}
            <MobileHeaderBar onMenuOpen={() => setMobileMenuOpen(true)} />

            <MobileMenuDrawer
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                openAuth={openAuth}
            />
        </header>
    );
}
