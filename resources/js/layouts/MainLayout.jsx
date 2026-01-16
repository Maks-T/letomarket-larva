import React from 'react';
import Header from "@/components/Header/index.jsx";
import Footer from "@components/Footer/index.jsx";
import { AuthModal } from "@/features/auth";
import { cn } from "@/lib/utils";

export default function MainLayout({ children, headerOverlaps = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <div className={cn(
        "w-full z-50 transition-all",
        headerOverlaps ? "absolute top-0 left-0 bg-transparent" : "relative bg-white"
      )}>
        {/*
                   Важно: Сам Header внутри должен быть готов к прозрачности.
                   Если у него жестко задан bg-white, прозрачность не сработает.
                   Можно передать className или props в Header, чтобы сделать его фон полупрозрачным.
                */}
        <Header transparentMode={headerOverlaps} />
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-grow mx-auto w-full",
        !headerOverlaps && "container p-4 border-l border-r border-dashed border-gray-300"
      )}>
        {children}
      </main>

      <Footer />

      <AuthModal />
    </div>
  );
}