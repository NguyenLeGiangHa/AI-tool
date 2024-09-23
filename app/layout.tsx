import { Metadata } from 'next';
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: 'Xây dựng chân dung khách hàng tiềm năng B2B',
  description: 'Hiểu rõ KPIS, Quy trình và Nhu cầu giải pháp của khách hàng tiềm năng để xây dựng chiến lược sản phẩm.',
  // You can add more metadata here if needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
