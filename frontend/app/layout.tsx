import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TwinMind AI',
  description: 'Agentic AI digital twin for gas turbine predictive maintenance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
