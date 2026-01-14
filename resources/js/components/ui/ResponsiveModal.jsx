import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query.js"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog.jsx"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer.jsx"

export default function ResponsiveModal({
                                            isOpen,
                                            onClose,
                                            children,
                                            title = "Вход в аккаунт",
                                            description
                                        }) {
    // Используем хук для определения мобильного устройства (или window.matchMedia)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="bg-white rounded-t-[20px]">
                <DrawerHeader className="sr-only">
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && <DrawerDescription>{description}</DrawerDescription>}
                </DrawerHeader>
                <div className="px-4 pb-8">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
