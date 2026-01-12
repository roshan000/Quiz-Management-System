import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Management System",
  description: "Create and take quizzes online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ background: '#333', color: '#fff', padding: '1rem' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '2rem' }}>
            Quiz System
          </a>
          <a href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>
            Admin Panel
          </a>
        </nav>
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
