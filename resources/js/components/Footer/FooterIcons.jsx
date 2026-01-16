import React from "react";

const SocialCircle = ({ className, href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 ${className}`}>
    {children}
  </a>
);

export const VkIcon = () => (
  <SocialCircle className="bg-[#0077FF]" href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v2.4h3.97c-.16 2.78-2.7 5.3-5.3 5.3h-4c10.5 3 13.5-3 13.5-3 .5 2.5 3 3 3 3h4c-4-4.5-4-4.5-4-4.5 3.5-3.5 4.5-4.5 4.5-4.5h-4c-3 4-3 4-3 4-1-2-1-4-1-4h-4z"/></svg></SocialCircle>
);
export const OkIcon = () => (
  <SocialCircle className="bg-[#F97422]" href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9Z"/><path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9 4.03 9 9Z"/></svg></SocialCircle>
);
export const YoutubeIcon = () => (
  <SocialCircle className="bg-[#FF0000]" href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg></SocialCircle>
);
export const TelegramIcon = () => (
  <SocialCircle className="bg-[#2AABEE]" href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></SocialCircle>
);
export const PinterestIcon = () => (
  <SocialCircle className="bg-[#E60023]" href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></SocialCircle>
);

const MarketCircle = ({ color, text, href }) => (
  <a href={href} className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[10px] hover:scale-110 transition-transform ${color}`}>{text}</a>
);
export const OzonIcon = () => <MarketCircle color="bg-[#005BFF]" text="OZ" href="#" />;
export const WbIcon = () => <MarketCircle color="bg-[#CB11AB]" text="WB" href="#" />;
export const YandexMarketIcon = () => <MarketCircle color="bg-[#FC3F1D]" text="ЯМ" href="#" />;