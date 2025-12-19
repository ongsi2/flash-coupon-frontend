import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "FLASH COUPON // 선착순 쿠폰 시스템",
  description: "Redis 기반 고성능 선착순 쿠폰 발급 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="arcade-bg min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
