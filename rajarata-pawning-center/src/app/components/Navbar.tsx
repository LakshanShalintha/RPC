'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, setLanguage, translations } = useLanguage()

  const t = translations.navbar || {}

  const links = [
    { key: 'home', path: '/home' },
    { key: 'services', path: '/services' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center py-4 px-4 md:px-20">
        <Link href="/home" className="hidden md:block text-3xl font-bold text-yellow-500 mr-4 md:mr-6">
          Rajarata Pawn
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 mr-2"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
        >
          <span className="block w-6 h-0.5 bg-black my-1" />
          <span className="block w-6 h-0.5 bg-black my-1" />
          <span className="block w-6 h-0.5 bg-black my-1" />
        </button>

        {/* Desktop navigation */}
        <ul className="hidden md:flex flex-1 justify-center space-x-8 text-[17px]">
          {links.map((link) => (
            <li key={link.key}>
              <Link
                href={link.path}
                className={`font-semibold ${
                  pathname === link.path ? 'text-yellow-500' : 'text-black hover:text-yellow-500'
                }`}
              >
                {t[link.key] || link.key}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language switch */}
        <div className="ml-auto flex space-x-3">
          <button
            onClick={() => setLanguage('en')}
            className={`text-[10px] font-semibold transition-colors ${
              language === 'en'
                ? 'text-black underline underline-offset-4'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('si')}
            className={`text-[10px] font-semibold transition-colors ${
              language === 'si'
                ? 'text-black underline underline-offset-4'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            සිංහල
          </button>
        </div>
      </div>
    </nav>
  )
}
