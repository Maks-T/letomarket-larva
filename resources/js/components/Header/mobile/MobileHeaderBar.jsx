import {Link} from "@inertiajs/react";
import {Menu, ShoppingCart} from "lucide-react";

export default function MobileHeaderBar({onMenuOpen}) {
  return (
    <div
      className="lg:hidden flex items-center justify-between px-4 h-[60px] border-b border-black/5 bg-white sticky top-0 z-40">
      <button
        onClick={onMenuOpen}
        className="w-10 h-10 -ml-2 flex items-center justify-center text-[#2F2F2F] hover:bg-black/5 rounded-full transition-colors"
        aria-label="Открыть меню"
      >
        <Menu size={26}/>
      </button>

      {/* Логотип */}
      <Link href="/" className="flex items-center gap-3 shrink-0 group">
        <img
          src="/images/logo.svg"
          alt="Логотип Letomarket"
          className="w-[239px] h-[48px] object-contain transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex items-center gap-1">
        <Link href="/cart"
              className="w-10 h-10 flex items-center justify-center text-[#2F2F2F] hover:bg-black/5 rounded-full relative transition-colors">
          <ShoppingCart size={24}/>
          <span className="absolute top-2 right-1.5 w-2.5 h-2.5 bg-[#F15921] border-2 border-white rounded-full"></span>
        </Link>
      </div>
    </div>
  );
}
