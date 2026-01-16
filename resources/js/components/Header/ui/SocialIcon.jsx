import { cn } from "@/lib/utils";

export default function SocialIcon({ href, icon: Icon, colorClass }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-sm",
                colorClass
            )}
        >
            <Icon size={14} fill="currentColor" />
        </a>
    );
}
