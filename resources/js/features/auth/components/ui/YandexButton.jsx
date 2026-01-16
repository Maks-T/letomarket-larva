import React from 'react';

export default function YandexButton({onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[51px] bg-black text-white rounded-2xl flex items-center justify-center gap-3 text-[16px] font-medium hover:bg-black/80 transition-all active:scale-[0.98]"
    >
      <div
        className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[14px] font-bold text-[#FC3F1D]">
        Я
      </div>
      Войти через Yandex
    </button>
  );
}