"use client";
import "styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
interface IProps {
  children: ReactNode;
}
export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SessionProvider>
          <div className={"min-h-screen"}>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
