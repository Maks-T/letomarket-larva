import { cn } from "@/lib/utils.js";

export default function Container({ children, className }) {
    return (
        <div className={cn("container mx-auto px-4", className)}>
            {children}
        </div>
    );
}
