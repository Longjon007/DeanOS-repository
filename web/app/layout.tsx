import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyperion AI",
  description: "Autonomous experimentally trained AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
