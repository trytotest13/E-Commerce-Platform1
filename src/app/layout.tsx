import { SessionProvider } from "@/components/providers/session-provider";
import { CartSync } from "@/components/cart/cart-sync";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider><CartSync />{children}</SessionProvider>
      </body>
    </html>
  );
}
