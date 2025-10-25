// src/app/layout.tsx
import { Providers } from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eleutherios - Policy and Service Marketplace',
  description: 'Join the policy and service marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}