// src/app/layout.tsx
import { DashboardProvider } from '@/contexts/DashboardContext'
import { ActivitiesProvider } from '@/contexts/ActivitiesContext'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

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
        <AuthProvider>
          <ActivitiesProvider>
            <DashboardProvider>
              {children}
            </DashboardProvider>
          </ActivitiesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}