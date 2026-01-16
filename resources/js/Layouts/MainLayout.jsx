import Header from "@/components/Header/index.jsx";
import Footer from "@/components/Footer.jsx";
import { AuthModal } from "@/features/auth";

export default function MainLayout({ children }) {
    // Мы просто рендерим AuthModal здесь, он сам подключится к контексту
    // и покажет себя, когда isOpen станет true

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto p-4 border-l border-r border-dashed border-gray-300">
                {children}
            </main>

            <Footer />

            {/* Глобальное окно авторизации */}
            <AuthModal />
        </div>
    );
}
