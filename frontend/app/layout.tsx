import './globals.css';
import type { Metadata } from 'next';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'TwinMind AI',
  description: 'Agentic AI digital twin for gas turbine predictive maintenance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
