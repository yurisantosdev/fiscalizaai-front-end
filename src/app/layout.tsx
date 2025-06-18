import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '@/redux/ReduxProvider'

export const metadata: Metadata = {
  title: 'FiscalizaAí',
  description: ''
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
