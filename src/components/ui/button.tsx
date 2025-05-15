import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-colors",
        className
      )}
      {...props}
    />
  );
}
