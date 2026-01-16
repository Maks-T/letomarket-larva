import React, {useState} from 'react';
import {cn} from "@/lib/utils.js";
import {Label} from "@components/ui/label";
import {Eye, EyeOff} from "lucide-react";
import ErrorMessage from "./ErrorMessage";

export default function PasswordInput({value, onChange, error, label = "Пароль"}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-[16px] font-medium text-[#4E4E4E] pl-1">{label}</Label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-[51px] w-full rounded-2xl bg-[#EBEBEB] px-5 pr-12 outline-none text-[16px] transition-all border border-transparent",
            "focus:border-[#424242] focus:bg-white focus:ring-0",
            error && "border-[#CA2D2D] bg-[#FFE7E7]"
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B3B3B3] hover:text-[#424242] transition-colors"
        >
          {show ? <EyeOff size={22}/> : <Eye size={22}/>}
        </button>
      </div>

      <ErrorMessage message={error}/>
    </div>
  );
}
