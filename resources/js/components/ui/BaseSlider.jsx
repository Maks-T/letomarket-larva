import React, { forwardRef } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

// Стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Универсальный слайдер
 * @param {Object} options - настройки Swiper (slidesPerView, loop и т.д.)
 * @param {string} className - классы для контейнера
 * @param {ReactNode} children - слайды (SwiperSlide)
 */
const BaseSlider = forwardRef(({ options, className, children, onSwiper }, ref) => {

  // Базовые модули, которые нужны везде
  const defaultModules = [Navigation, Pagination, Autoplay, A11y];

  return (
    <Swiper
      ref={ref}
      onSwiper={onSwiper}
      modules={[...defaultModules, ...(options?.modules || [])]}
      {...options}
      className={className}
    >
      {children}
    </Swiper>
  );
});

BaseSlider.displayName = 'BaseSlider';

export default BaseSlider;