import React from 'react';

export default function YandexMapWidget() {
  return (
    <div className="w-full h-[200px] xl:h-[320px] rounded-xl overflow-hidden bg-gray-800 relative">
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A5c7408dc1b67c05e7b1d28a73462a88e2a0f7504c5907b0e3f3eccd1d29aa994&amp;source=constructor"
        width="100%"
        height="100%"
        frameBorder="0"
        className="absolute inset-0 w-full h-full"
        title="Карта проезда Letomarket"
      ></iframe>
    </div>
  );
}