import './globals.css';

export const metadata = {
  title: 'Stocks.in — Live Market Dashboard',
  description: 'Professional candlestick charts and market trading platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#111318] text-white font-sans antialiased">{children}</body>
    </html>
  );
}
