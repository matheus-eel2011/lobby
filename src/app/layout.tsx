import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pega Blinder - Lobby de Torneios',
  description: 'Acompanhe os melhores torneios de poker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="/poker-init.js"
          strategy="beforeInteractive"
          priority
        />
        <Script
          src="/poker-storage.js"
          strategy="afterInteractive"
        />
        <Script 
          src="/poker-save.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
