import "./globals.css";

export const metadata = {
  title: "Urban Bites | Luxury Restaurant Menu",
  description: "Crafted with Passion, Served with Style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

