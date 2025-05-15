import { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = {
  label?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  children,
  className,
  label,
  id,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className={cn(
          "border border-gray-300 rounded-xl px-3 py-2.5 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        id={id}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return <option value={value}>{children}</option>;
}

// Apenas para manter compatibilidade com a API usada no seu código
export function SelectTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
