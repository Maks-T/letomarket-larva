import { cn } from "@/lib/utils.js";

export default function BaseContainer({ children, className }) {
    return (
        <div className={cn("container mx-auto px-4 md:px-0", className)}>
            {children}
        </div>
    );
}
