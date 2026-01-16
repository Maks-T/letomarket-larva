import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils.js";

export default function AuthCard({ title, onBack, children, className }) {
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Заголовок и кнопка назад */}
      <div className="flex items-center gap-2 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-2 text-[#8A8A8A] hover:text-[#424242] transition-colors rounded-full hover:bg-black/5"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
        )}
        <h2 className="text-[20px] font-medium text-[#F15921] leading-none pt-0.5">
          {title}
        </h2>
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}