import React from 'react';
import {cn} from "@/lib/utils";
import {Loader2} from "lucide-react";

export default function AuthButton({
                                     children,
                                     className,
                                     variant = 'primary', // primary | secondary
                                     loading = false,
                                     disabled = false,
                                     onClick,
                                     type = 'button'
                                   }) {
  // Базовые стили
  const baseStyles = "w-full h-[51px] rounded-2xl flex items-center justify-center text-[16px] font-medium transition-all active:scale-[0.98] relative overflow-hidden";

  // Варианты стилей
  const variants = {
    primary: "bg-[#F15921] hover:bg-[#ff7340] text-white disabled:bg-[#FDAA8C] disabled:cursor-not-allowed",
    secondary: "border-2 border-[#3DC5FF] bg-[#F5F8FA] text-[#3DC5FF] hover:bg-white disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], className)}
    >
      {loading ? (
        <Loader2 className="animate-spin w-6 h-6 absolute"/>
      ) : (
        <span className={cn(loading && "opacity-0")}>
                    {children}
                </span>
      )}
    </button>
  );
}