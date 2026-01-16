import React, { useRef } from 'react';
import { SwiperSlide } from 'swiper/react';
import BaseSlider from '@/components/ui/BaseSlider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


// Пример данных (потом заменишь на пропсы из Laravel)
const SLIDES = [
  {
    id: 1,
    image: '/images/hero/hero-1.webp', // Замени на свои пути
    title: 'Террасная доска ДПК',
    subtitle: 'Идеальное решение для загородного дома'
  },
  {
    id: 2,
    image: '/images/hero/hero-2.webp',
    title: 'Фасадные панели',
    subtitle: 'Долговечность и стиль'
  },
  {
    id: 3,
    image: '/images/hero/hero-3.webp',
    title: 'Ограждения',
    subtitle: 'Безопасность и красота'
  }
];

export default function HeroSlider() {
  // Рефы для привязки кастомных стрелок
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const sliderOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.hero-pagination', // Кастомный класс пагинации
      clickable: true,
      bulletClass: 'w-2.5 h-2.5 bg-white/50 rounded-full mx-1.5 cursor-pointer transition-all hover:bg-white',
      bulletActiveClass: '!bg-[#F15921] !w-3 !h-3', // Активная точка оранжевая и чуть больше
    },
    navigation: {
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    },
    // Важно: обновляем навигацию после инициализации, чтобы рефы подцепились
    onBeforeInit: (swiper) => {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    },
  };

  return (
    <div className="relative w-full max-w-[2560px] mx-auto h-dvh min-h-[600px] overflow-hidden group">

      <BaseSlider options={sliderOptions} className="h-full w-full">
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Картинка на фон */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Затемнение (градиент снизу вверх) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Контент (если нужен текст поверх) */}
            {/* <div className="absolute bottom-20 left-4 md:left-10 lg:left-20 text-white z-10">
                            <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-xl md:text-2xl opacity-90">{slide.subtitle}</p>
                        </div> */}
          </SwiperSlide>
        ))}
      </BaseSlider>

      {/* --- Кастомные элементы управления --- */}

      {/* Стрелка ВЛЕВО */}
      <button
        ref={prevRef}
        className={cn(
          "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20",
          "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30",
          "flex items-center justify-center text-white transition-all hover:bg-white/40 hover:scale-105 active:scale-95",
          "opacity-0 group-hover:opacity-100 duration-300" // Появляется при наведении на слайдер
        )}
      >
        <ChevronLeft size={28} />
      </button>

      {/* Стрелка ВПРАВО */}
      <button
        ref={nextRef}
        className={cn(
          "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20",
          "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30",
          "flex items-center justify-center text-white transition-all hover:bg-white/40 hover:scale-105 active:scale-95",
          "opacity-0 group-hover:opacity-100 duration-300"
        )}
      >
        <ChevronRight size={28} />
      </button>

      {/* Пагинация (точки) */}
      <div className="hero-pagination absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center" />
    </div>
  );
}