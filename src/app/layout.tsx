import { DashboardProvider } from '@/contexts/DashboardContext'
import './globals.css'  // Make sure this is here
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}