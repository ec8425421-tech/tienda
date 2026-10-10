import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "Riqueza local",
  Description: "..",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />

          <main className="contenido">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}