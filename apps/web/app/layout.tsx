import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col font-inter">
        <Header />
        <main className="flex-grow p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}