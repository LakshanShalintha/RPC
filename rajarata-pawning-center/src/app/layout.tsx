import Footer from './components/Footer'
import Navbar from './components/Navbar'
import './globals.css'
import { LanguageProvider } from './context/LanguageContext'

export const metadata = {
  title: 'Rajarata Pawning Center',
  description: 'Trusted pawn service in Sri Lanka',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
