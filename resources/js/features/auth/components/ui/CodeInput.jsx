import {useState, useRef} from 'react';
import {cn} from "@/lib/utils.js";
import {Label} from "@components/ui/label";

export default function CodeInput({length = 6, onComplete, error, disabled}) {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val && e.nativeEvent.inputType !== 'deleteContentBackward') return;
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);
    if (val && index < length - 1) inputsRef.current[index + 1].focus();
    if (newCode.every(c => c !== '')) onComplete(newCode.join(''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];
      if (!code[index] && index > 0) {
        newCode[index - 1] = '';
        inputsRef.current[index - 1].focus();
      } else {
        newCode[index] = '';
      }
      setCode(newCode);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-[16px] font-medium text-[#4E4E4E] pl-1">Введите код подтверждения:</Label>
      <div className="flex justify-between gap-2.5">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="number"
            className={cn(
              "w-[48px] h-[51px] text-center text-[32px] font-normal rounded-[10px] bg-[#EBEBEB] border-none outline-none focus:ring-1 focus:ring-[#424242] transition-all",
              error && "ring-1 ring-[#CA2D2D] bg-[#FFE7E7]",
              "appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            value={digit}
            onInput={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
