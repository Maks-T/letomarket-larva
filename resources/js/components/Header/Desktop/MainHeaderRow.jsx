import { Link } from "@inertiajs/react";
import { Search, Menu, User, Heart, ShoppingCart } from "lucide-react";
import HeaderContainer from "../UI/HeaderContainer";
import ActionPill from "../UI/ActionPill";

export default function MainHeaderRow({ user, openAuth }) {
    return (
        <div className="py-4 hidden lg:block">
            <HeaderContainer>
                <div className="flex items-center justify-between gap-6">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-[48px] h-[48px] bg-[#F15921] rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105">
                            <div className="w-7 h-7 border-2 border-white/40 border-dashed rounded-full animate-[spin_10s_linear_infinite]" />
                        </div>
                        <span className="text-[24px] font-black text-[#2F2F2F] tracking-tighter uppercase leading-none">
                            Letomarket<span className="text-[#F15921]">.ru</span>
                        </span>
                    </Link>

                    {/* Кнопка Каталог */}
                    <button className="flex items-center gap-3 bg-[#F15921] hover:bg-[#D94916] text-white h-[44px] px-6 rounded-full font-normal text-[16px] transition-all shrink-0">
                        <Menu size={22} />
                        Каталог
                    </button>

                    {/* Поиск */}
                    <div className="flex flex-1 max-w-[640px] relative">
                        <input
                            type="text"
                            placeholder="Поиск по сайту"
                            className="w-full h-[44px] bg-[#F7F7F7] hover:bg-[#F0F0F0] focus:bg-white border border-[#DFDFDF] focus:border-[#F15921] rounded-full pl-6 pr-12 outline-none text-[15px] text-[#2F2F2F] placeholder:text-[#8A8A8A] transition-all"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8A8A8A] hover:text-[#F15921]">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex items-center gap-3 shrink-0">
                        {user ? (
                            <ActionPill icon={User} label="Кабинет" href="/cabinet" />
                        ) : (
                            <ActionPill icon={User} label="Кабинет" onClick={() => openAuth('login')} />
                        )}

                        <ActionPill icon={Heart} label="Избранное" href="/favorites" />
                        <ActionPill icon={ShoppingCart} label="Корзина" href="/cart" variant="yellow" count={2} />
                    </div>
                </div>
            </HeaderContainer>
        </div>
    );
}
