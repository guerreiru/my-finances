import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={cn(
          "border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        id={id}
        {...props}
      />
    </div>
  );
}
