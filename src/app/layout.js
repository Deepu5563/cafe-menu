import "./globals.css";
import { themeToCssVars } from "@/lib/theme";
import { fetchTheme } from "@/app/actions/themeActions";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Urban Bites | Luxury Restaurant Menu",
  description: "Crafted with Passion, Served with Style",
};

export default async function RootLayout({ children }) {
  const theme = await fetchTheme();
  const cssVars = themeToCssVars(theme);

  return (
    <html lang="en" style={cssVars}>
      <body className="antialiased">
        <ThemeProvider initialTheme={theme} initialShowImages={theme.showImages}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
