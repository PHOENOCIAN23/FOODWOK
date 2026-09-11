import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderProvider } from '@/context/OrderContext';
import { MenuProvider } from '@/context/MenuContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Foodwok - Authentic Nigerian Cuisine',
  description: 'Party jollof, smoky fried rice, and rich spaghetti — hot and delivered to your door.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="bg-[#F9FAFB] text-slate-900 antialiased selection:bg-[#EB3223] selection:text-white">
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <OrderProvider>{children}</OrderProvider>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
