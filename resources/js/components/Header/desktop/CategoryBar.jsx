import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import BaseContainer from "@components/ui/BaseContainer.jsx";
import { CATEGORIES } from "../constants";

export default function CategoryBar({ currentPath }) {
  return (
    <div className="hidden lg:block border-t border-border">
      <BaseContainer>
        <div className="flex items-center justify-between h-[52px]">
          <nav className="flex-1 overflow-hidden">
            <ul className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat, idx) => (
                <li key={cat.href} className="flex items-center shrink-0">
                  <Link
                    href={cat.href}
                    className={cn(
                      "text-[16px] font-normal transition-colors whitespace-nowrap flex items-center gap-1.5",
                      cat.highlight
                        ? "text-destructive" // Красный цвет текста
                        : "text-muted-foreground hover:text-primary",
                      currentPath === cat.href && "text-primary"
                    )}
                  >
                    {/* Если есть иконка — показываем её */}
                    {cat?.icon ? (
                      <cat.icon className="w-[18px] h-[18px] text-current" />
                    ) : (
                      /* Иначе показываем точку, если highlight */
                      cat.highlight && (
                        <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                      )
                    )}

                    {cat.label}
                  </Link>

                  {idx === 0 && <div className="w-px h-5 bg-border ml-8" />}
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-primary text-[15px] font-normal whitespace-nowrap ml-4">
            Дарим 100 бонусов за регистрацию
          </div>
        </div>
      </BaseContainer>
    </div>
  );
}