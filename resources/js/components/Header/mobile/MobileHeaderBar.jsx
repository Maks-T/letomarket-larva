import { Link } from "@inertiajs/react";
import { Menu, ShoppingCart } from "lucide-react";

export default function MobileHeaderBar({ onMenuOpen }) {
    return (
        <div className="lg:hidden flex items-center justify-between px-4 h-[60px] border-b border-black/5 bg-white sticky top-0 z-40">
            <button
                onClick={onMenuOpen}
                className="w-10 h-10 -ml-2 flex items-center justify-center text-[#2F2F2F] hover:bg-black/5 rounded-full transition-colors"
                aria-label="Открыть меню"
            >
                <Menu size={26} />
            </button>

            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F15921] rounded-full flex items-center justify-center text-white">
                    <div className="w-4 h-4 border border-white/40 border-dashed rounded-full" />
                </div>
                <span className="text-xl font-black text-[#2F2F2F] uppercase tracking-tighter">
                    Letomarket
                </span>
            </Link>

            <div className="flex items-center gap-1">
                <Link href="/cart" className="w-10 h-10 flex items-center justify-center text-[#2F2F2F] hover:bg-black/5 rounded-full relative transition-colors">
                    <ShoppingCart size={24} />
                    <span className="absolute top-2 right-1.5 w-2.5 h-2.5 bg-[#F15921] border-2 border-white rounded-full"></span>
                </Link>
            </div>
        </div>
    );
}
