import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-white h-full flex flex-col">
        <header className="bg-green-600 text-white p-4">
          <h1 className="text-2xl font-bold">Simple UI</h1>
        </header>
        <main className="flex-grow flex flex-col overflow-hidden">{children}</main>
      </body>
    </html>
  );
}