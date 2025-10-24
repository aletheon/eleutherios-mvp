// src/app/layout.tsx
import { DashboardProvider } from '@/contexts/DashboardContext'
import { ActivitiesProvider } from '@/contexts/ActivitiesContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
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
        <ErrorBoundary>
          <AuthProvider>
            <ActivitiesProvider>
              <DashboardProvider>
                {children}
              </DashboardProvider>
            </ActivitiesProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}