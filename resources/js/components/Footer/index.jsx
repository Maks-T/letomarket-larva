import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, Mail } from 'lucide-react';
import Container from '@/components/ui/Container'; // Ваш общий контейнер
import YandexMapWidget from './YandexMapWidget';
import { CATALOG_LINKS, BUYERS_LINKS, BUSINESS_LINKS, COMPANY_LINKS } from './constants';
import { VkIcon, OkIcon, YoutubeIcon, TelegramIcon, PinterestIcon, OzonIcon, WbIcon, YandexMarketIcon } from './FooterIcons';

export default function Footer() {
  return (
    <footer className="bg-[#212226] text-white pt-12 pb-6 mt-auto">
      <Container>
        {/* СЕТКА: На мобилках 1 колонка, на планшетах 2, на десктопе 12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 xl:gap-6 mb-12">

          {/* [КОЛОНКА 1] Лого, Кнопка, Контакты (3/12) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Логотип */}
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <img
                src="/images/logo-white.svg" // Убедитесь, что у вас есть белый логотип
                alt="Letomarket"
                className="h-[40px] w-auto object-contain"
                onError={(e) => e.target.style.display = 'none'} // Скрыть если нет картинки
              />
            </Link>

            <button className="bg-[#F15921] hover:bg-[#d94916] text-white font-medium h-[48px] rounded-lg w-full max-w-[280px] transition-colors shadow-lg shadow-orange-900/20 cursor-pointer">
              Заказать обратный звонок
            </button>

            <div className="flex flex-col gap-3 mt-1">
              <a href="tel:+79609204830" className="flex items-center gap-3 text-[20px] font-bold hover:text-[#F15921] transition-colors">
                <Phone className="w-5 h-5 text-[#8A8A8A]" />
                +7-960-920-4830
              </a>
              <a href="mailto:letomarket@ps42.ru" className="flex items-center gap-3 text-[16px] hover:text-[#F15921] transition-colors text-[#B0B0B0]">
                <Mail className="w-5 h-5 text-[#8A8A8A]" />
                letomarket@ps42.ru
              </a>
            </div>
          </div>

          {/* [КОЛОНКА 2] Каталог (2/12) */}
          <div className="xl:col-span-2">
            <h3 className="font-bold text-[18px] mb-5 text-white">Каталог</h3>
            <ul className="space-y-2.5">
              {CATALOG_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#B0B0B0] hover:text-[#F15921] transition-colors text-[15px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* [КОЛОНКА 3] Покупателям (2/12) */}
          <div className="xl:col-span-2">
            <h3 className="font-bold text-[18px] mb-5 text-white">Покупателям</h3>
            <ul className="space-y-2.5">
              {BUYERS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#B0B0B0] hover:text-[#F15921] transition-colors text-[15px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* [КОЛОНКА 4] О компании + Бизнесу (2/12) */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="font-bold text-[18px] mb-5 text-white">О компании</h3>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#B0B0B0] hover:text-[#F15921] transition-colors text-[15px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[18px] mb-5 text-white">Для бизнеса</h3>
              <ul className="space-y-2.5">
                {BUSINESS_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#B0B0B0] hover:text-[#F15921] transition-colors text-[15px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* [КОЛОНКА 5] Карта и Соцсети (3/12) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <h3 className="font-bold text-[18px] text-white">Как к нам проехать</h3>

            {/* Карта через iframe */}
            <YandexMapWidget />

            <p className="text-[15px] text-white">
              Адрес: г. Кемерово, ул. Дарвина, д. 6, кв. 31
            </p>

            <div className="space-y-4">
              <div>
                <div className="text-[14px] text-[#8A8A8A] mb-3">Наши социальные сети:</div>
                <div className="flex gap-2 flex-wrap">
                  <VkIcon /><OkIcon /><YoutubeIcon /><TelegramIcon /><PinterestIcon />
                </div>
              </div>

              <div>
                <div className="text-[14px] text-[#8A8A8A] mb-3">Мы на маркетплейсах:</div>
                <div className="flex gap-2">
                  <OzonIcon /><WbIcon /><YandexMarketIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-[#3A3B3F] pt-6 mt-6">
          <div className="text-center text-[#68696D] text-[13px]">
            ООО "ЛЕТОМАРКЕТ", ИНН 2465337628, г. Кемерово, ул. Дарвина, д. 6, кв. 31, +79617292230
          </div>
        </div>
      </Container>
    </footer>
  );
}