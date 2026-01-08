import Header from "@components/Header.jsx";
import Footer from "@components/Footer.jsx";


export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Шапка */}
      <Header />

      {/* Контент меняется здесь */}
      <main className="flex-grow container mx-auto p-4 border-l border-r border-dashed border-gray-300">
        {children}
      </main>

      {/* Подвал */}
      <Footer />
    </div>
  );
}