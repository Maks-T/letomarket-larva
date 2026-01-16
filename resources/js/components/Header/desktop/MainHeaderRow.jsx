import { Link } from "@inertiajs/react";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import Container from "@components/ui/Container.jsx";
import ActionPill from "@components/Header/ui/ActionPill";

export default function MainHeaderRow({ user, openAuth }) {
    return (
      <div className="py-4 hidden lg:block">
          <Container>
              <div className="flex items-center justify-between gap-6">

                  {/* Логотип */}
                  <Link href="/" className="flex items-center gap-3 shrink-0 group">
                      <img
                        src="/images/logo.svg"
                        alt="Логотип Letomarket"
                        className="w-[239px] h-[48px] object-contain transition-transform group-hover:scale-105"
                      />
                  </Link>

                  {/* Кнопка Каталог */}
                  <button className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground h-[44px] px-6 rounded-full font-normal text-[16px] transition-all shrink-0">
                      <Menu size={22} />
                      Каталог
                  </button>

                  {/* Поиск */}
                  <div className="flex flex-1 max-w-[640px] relative">
                      <input
                        type="text"
                        placeholder="Поиск по сайту"
                        className="w-full h-[44px] bg-secondary hover:bg-secondary/80 focus:bg-background border border-input focus:border-primary rounded-full pl-6 pr-12 outline-none text-[15px] text-foreground placeholder:text-muted-foreground transition-all"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors">
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
          </Container>
      </div>
    );
}