import React from 'react';
import {Link} from '@inertiajs/react';
import {Phone, Mail} from 'lucide-react';
import BaseContainer from '@components/ui/BaseContainer.jsx';
import YandexMapWidget from './YandexMapWidget';
import {CATALOG_LINKS, BUYERS_LINKS, BUSINESS_LINKS, COMPANY_LINKS} from './constants';
import {
  VkIcon,
  OkIcon,
  YoutubeIcon,
  TelegramIcon,
  PinterestIcon,
  OzonIcon,
  WbIcon,
  YandexMarketIcon
} from './FooterIcons';

// Вспомогательный компонент для заголовка-ссылки
const FooterHeader = ({href, children}) => (
  <h3 className="font-bold text-[16px] md:text-[18px] mb-4 md:mb-5 text-white">
    <Link href={href} className="hover:text-[#F15921] transition-colors">
      {children}
    </Link>
  </h3>
);

// Вспомогательный компонент для списка ссылок
const FooterLinks = ({links}) => (
  <ul className="space-y-2 md:space-y-3">
    {links.map((link) => (
      <li key={link.href}>
        <Link
          href={link.href}
          className={`text-[14px] md:text-[15px] transition-colors ${
            link.highlight ? 'text-[#F15921] font-medium' : 'text-[#B0B0B0] hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default function Footer() {
  return (
    <footer className="bg-[#212226] text-white pt-10 pb-6 md:pt-14 mt-auto border-t border-[#3A3B3F]">
      <BaseContainer>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-y-10 gap-x-8 mb-10">
          {/* [БЛОК 1] Лого, Кнопка, Контакты */}
          <div className="col-span-2 md:col-span-1 xl:col-span-3 flex flex-col items-start">

            {/* 1. Логотип */}
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <img
                src="/images/logo-white.svg"
                alt="Letomarket"
                className="h-[32px] md:h-[40px] w-auto object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            </Link>

            {/* 2. Кнопка "Заказать звонок" */}
            <button
              className="bg-[#F15921] hover:bg-[#d94916] active:scale-[0.98] text-white font-bold text-[16px] py-4 px-8 rounded-full w-full max-w-[320px] transition-all shadow-lg shadow-orange-500/20 mb-10">
              Заказать обратный звонок
            </button>

            {/* 3. Контакты */}
            <div className="flex flex-col gap-6 w-full">
              {/* Телефон */}
              <a
                href="tel:+79609204830"
                className="flex items-center gap-4 group w-fit"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white group-hover:text-[#F15921] transition-colors stroke-[1.5px]"/>
                </div>
                <span
                  className="text-[22px] font-bold text-white group-hover:text-[#F15921] transition-colors whitespace-nowrap">
                +7-960-920-4830
            </span>
              </a>

              {/* Почта */}
              <a
                href="mailto:letomarket@ps42.ru"
                className="flex items-center gap-4 group w-fit"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white group-hover:text-[#F15921] transition-colors stroke-[1.5px]"/>
                </div>
                <span className="text-[18px] font-medium text-white group-hover:text-[#F15921] transition-colors">
                letomarket@ps42.ru
            </span>
              </a>
            </div>
          </div>
          {/* [БЛОК 2] МЕНЮ (6 колонок из 12) */}
          <div className="xl:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">

            {/* 1. Каталог */}
            <div className="col-span-1">
              <FooterHeader href="/catalog">Каталог</FooterHeader>
              <FooterLinks links={CATALOG_LINKS}/>
            </div>

            {/* 2. Покупателям */}
            <div className="col-span-1">
              <FooterHeader href="/buyers">Покупателям</FooterHeader>
              <FooterLinks links={BUYERS_LINKS}/>
            </div>

            {/* 3. О компании + Для бизнеса (Стек) */}
            {/* На мобильном этот блок уедет вниз и займет всю ширину (или 2 колонки) */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-8">
              <div>
                <FooterHeader href="/about">О компании</FooterHeader>
                <FooterLinks links={COMPANY_LINKS}/>
              </div>
              <div>
                <FooterHeader href="/business">Для бизнеса</FooterHeader>
                <FooterLinks links={BUSINESS_LINKS}/>
              </div>
            </div>
          </div>

          {/* [БЛОК 3] Карта и Соцсети (3 колонки из 12) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <h3 className="font-bold text-[16px] md:text-[18px] text-white">Как к нам проехать</h3>

            <YandexMapWidget/>

            <p className="text-[14px] md:text-[15px] text-white">
              Адрес: г. Кемерово, ул. Дарвина, д. 6, кв. 31
            </p>

            <div className="space-y-5">
              <div>
                <div className="text-[13px] md:text-[14px] text-[#8A8A8A] mb-3">Наши социальные сети:</div>
                <div className="flex gap-2 flex-wrap">
                  <VkIcon/><OkIcon/><YoutubeIcon/><TelegramIcon/><PinterestIcon/>
                </div>
              </div>

              <div>
                <div className="text-[13px] md:text-[14px] text-[#8A8A8A] mb-3">Мы на маркетплейсах:</div>
                <div className="flex gap-2">
                  <OzonIcon/><WbIcon/><YandexMarketIcon/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-[#3A3B3F] pt-6 mt-6">
          <div className="text-center text-[#68696D] text-[12px] md:text-[13px] leading-relaxed">
            ООО "ЛЕТОМАРКЕТ", ИНН 2465337628, г. Кемерово, ул. Дарвина, д. 6, кв. 31, +79617292230
          </div>
        </div>
      </BaseContainer>
    </footer>
  );
}