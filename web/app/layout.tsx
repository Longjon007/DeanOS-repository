export const metadata = {
  title: 'Hyperien Templates',
  description: 'Explore starter templates and track todos powered by Hyperien AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
