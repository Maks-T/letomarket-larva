import React from 'react';
import {cn} from "@/lib/utils";

export default function ErrorMessage({message, variant = 'text', className}) {
  if (!message) return null;

  const variants = {
    // Простой текст (для пароля)
    text: "text-[#CA2D2D] text-[14px] italic pl-1 animate-in fade-in slide-in-from-top-1",

    // Плашка с фоном (для телефона и кода)
    box: "bg-[#FFE7E7] text-[#CA2D2D] text-[14px] italic px-3 py-1.5 rounded-lg border border-[#CA2D2D]/10 animate-in fade-in zoom-in-95"
  };

  return (
    <div className={cn(variants[variant], className)}>
      {message}
    </div>
  );
}