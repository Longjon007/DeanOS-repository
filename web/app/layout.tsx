import React from 'react'

export const metadata = {
  title: 'Hyperion AI',
  description: 'Autonomous experimentally trained AI interface',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
