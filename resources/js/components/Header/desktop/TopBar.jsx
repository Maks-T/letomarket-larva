import { Link } from "@inertiajs/react";
import { MapPin, Phone, Instagram, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import BaseContainer from "@components/ui/BaseContainer.jsx";
import SocialIcon from "@components/Header/ui/SocialIcon";
import { TOP_MENU_ITEMS, PHONE_NUMBER } from "../constants";

export default function TopBar({ currentPath }) {
    return (
        <div className="hidden xl:block">
            <BaseContainer>
                <div className="flex justify-between items-center h-[50px]">
                    <div className="flex items-center gap-8">
                        <button className="flex items-center gap-1.5 hover:text-[#F15921] transition-colors font-normal text-[15px] text-[#2F2F2F]">
                            <MapPin size={16} />
                            <span>Кемерово</span>
                        </button>
                        <nav>
                            <ul className="flex items-center gap-6">
                                {TOP_MENU_ITEMS.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "hover:text-[#F15921] transition-colors text-[15px] font-normal text-[#2F2F2F]",
                                                currentPath === item.href && "text-[#F15921]"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 font-medium text-[15px] text-[#2F2F2F] hover:text-[#F15921]">
                            <Phone size={16} />
                            {PHONE_NUMBER}
                        </a>
                        <div className="flex gap-2">
                            <SocialIcon icon={Instagram} href="#" colorClass="bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" />
                            <SocialIcon icon={Send} href="#" colorClass="bg-[#0088cc]" />
                        </div>
                    </div>
                </div>
            </BaseContainer>
        </div>
    );
}
