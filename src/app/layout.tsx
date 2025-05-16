import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minhas finanças - Gerenciador de Despesas Pessoais",
  description:
    "Controle suas finanças com facilidade. Adicione despesas, visualize gráficos por categoria e mantenha seu orçamento sob controle com o MeuDinheiro.",
  keywords: [
    "controle financeiro",
    "gerenciador de despesas",
    "organização financeira",
    "finanças pessoais",
    "app de finanças",
    "controle de gastos",
  ],
  authors: [{ name: "Fernando Guerreiro" }],
  creator: "Fernando Guerreiro",
  openGraph: {
    title: "Minhas finanças - Gerencie suas despesas com facilidade",
    description:
      "Acompanhe suas despesas mensais, visualize gráficos e mantenha seu orçamento sob controle.",
    url: "https://my-finances-rho.vercel.app",
    siteName: "Minhas finanças",
    images: [
      {
        url: "https://my-finances-rho.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gráfico de despesas do Minhas finanças",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
