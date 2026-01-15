import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function ActionPill({ href, onClick, icon: Icon, label, variant = "default", count }) {
    const baseClass = "flex items-center gap-2.5 h-[44px] px-5 rounded-full transition-all duration-200 font-normal text-[16px] select-none shrink-0";

    const variants = {
        default: "bg-[#F7F7F7] text-[#2F2F2F] border border-[#DFDFDF] hover:bg-[#F0F0F0] active:bg-[#E5E5E5]",
        yellow: "bg-[#FFD752] text-[#2F2F2F] hover:bg-[#FFC729] active:bg-[#FFB700] border border-transparent",
    };

    const content = (
        <>
            <Icon size={20} strokeWidth={2} className="text-[#2F2F2F]" />
            <span className="hidden xl:inline leading-none pb-[1px]">{label}</span>
            {count !== undefined && (
                <span className="ml-1 text-xs font-bold bg-[#F15921] text-white px-1.5 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </>
    );

    if (href) {
        return <Link href={href} className={cn(baseClass, variants[variant])}>{content}</Link>;
    }
    return <button onClick={onClick} className={cn(baseClass, variants[variant])}>{content}</button>;
}
