import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import HeaderContainer from "../UI/HeaderContainer";
import { CATEGORIES } from "../constants";

export default function CategoryBar({ currentPath }) {
    return (
        <div className="border-t border-black/5 hidden lg:block">
            <HeaderContainer>
                <div className="flex items-center justify-between h-[52px]">
                    <nav className="flex-1 overflow-hidden">
                        <ul className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
                            {CATEGORIES.map((cat, idx) => (
                                <li key={cat.href} className="flex items-center shrink-0">
                                    <Link
                                        href={cat.href}
                                        className={cn(
                                            "text-[16px] font-normal transition-colors whitespace-nowrap flex items-center gap-1.5",
                                            cat.highlight ? "text-[#E12828]" : "text-[#4E4E4E] hover:text-[#F15921]",
                                            currentPath === cat.href && "text-[#F15921]"
                                        )}
                                    >
                                        {cat.highlight && <span className="w-1.5 h-1.5 bg-[#E12828] rounded-full animate-pulse" />}
                                        {cat.label}
                                    </Link>
                                    {idx === 0 && <div className="w-px h-5 bg-black/10 ml-8" />}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="text-[#F15921] text-[15px] font-normal whitespace-nowrap ml-4">
                        Дарим 100 бонусов за регистрацию
                    </div>
                </div>
            </HeaderContainer>
        </div>
    );
}
