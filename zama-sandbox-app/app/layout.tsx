import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { KeyProvider } from "@/lib/key/context";
import { SessionProvider } from "@/lib/session/context";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/theme";

const telegraf = localFont({
  src: [
    {
      path: '../public/TelegrafRegular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Telegraf UltraBold 800.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/Telegraf UltraLight 200.woff',
      weight: '200',
      style: 'normal',
    }
  ],
  variable: '--font-telegraf',
});

export const metadata: Metadata = {
  title: "Zama API key sandbox demo",
  description: "Skill test for Zama by Steven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${telegraf.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SessionProvider>
              <KeyProvider>
                {children}
              </KeyProvider>
            </SessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
