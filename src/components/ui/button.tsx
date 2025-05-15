import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-green-600 hover:bg-green-700 text-white",
  secondary: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "border border-gray-400 text-gray-800 bg-white hover:bg-gray-100",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 transition-colors border border-transparent",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
