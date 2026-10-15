import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../redux/ReduxProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Iron Man Gym — SuperAdmin Console',
  description: 'Multi-Tenant SaaS Fleet Management & Analytics Command Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#09090b] text-zinc-100 min-h-screen antialiased selection:bg-red-600 selection:text-white"
        suppressHydrationWarning
      >
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </ReduxProvider>
      </body>
    </html>
  );
}
