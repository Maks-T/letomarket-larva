import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import AuthModal from "@/Components/Auth/UI/AuthModal";
import { useAuth } from "@/Contexts/AuthContext";

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
