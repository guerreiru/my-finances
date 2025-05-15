export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrencyBR(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
