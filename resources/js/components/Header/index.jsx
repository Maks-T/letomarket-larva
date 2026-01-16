import {useState} from "react";
import {usePage} from "@inertiajs/react";
import {useAuth} from "@/features/auth";
import TopBar from "@components/Header/desktop/TopBar";
import MainHeaderRow from "@components/Header/desktop/MainHeaderRow";
import CategoryBar from "@components/Header/desktop/CategoryBar";
import MobileHeaderBar from "@components/Header/mobile/MobileHeaderBar";
import MobileMenuDrawer from "@components/Header/mobile/MobileMenuDrawer";
import {cn} from "@/lib/utils.js";

export default function Header({ transparentMode = false }) {
    const { openAuth } = useAuth();
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Получение текущего пути для подсветки активных ссылок
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    return (
      <header
        className={cn(
          "w-full relative z-30 transition-colors duration-300",
          transparentMode
            ? "bg-white/90 backdrop-blur-sm border-b border-white/20" // Полупрозрачный для Hero
            : "bg-[rgba(245,243,240,0.94)] shadow-sm sticky top-0"    // Обычный
        )}
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
