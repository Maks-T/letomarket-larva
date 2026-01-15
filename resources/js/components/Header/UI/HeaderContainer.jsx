import { cn } from "@/lib/utils";

export default function HeaderContainer({ children, className }) {
    return (
        <div className={cn("container mx-auto px-4", className)}>
            {children}
        </div>
    );
}
