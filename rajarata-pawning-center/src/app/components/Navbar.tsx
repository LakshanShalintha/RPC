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
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-20">
        {/* Logo - only visible on desktop */}
        <Link
          href="/home"
          className="hidden md:block text-3xl font-bold text-yellow-500"
        >
          Rajarata Pawn
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
        >
          {menuOpen ? (
            // Cancel (X) icon
            <span className="text-2xl font-bold text-black">&times;</span>
          ) : (
            // Menu (☰) icon
            <>
              <span className="block w-6 h-0.5 bg-black my-1" />
              <span className="block w-6 h-0.5 bg-black my-1" />
              <span className="block w-6 h-0.5 bg-black my-1" />
            </>
          )}
        </button>

        {/* Language Switch */}
        <div className="flex space-x-3">
          <button
            onClick={() => setLanguage('en')}
            className={`text-[12px] font-semibold transition-colors ${
              language === 'en'
                ? 'text-black underline underline-offset-4'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('si')}
            className={`text-[12px] font-semibold transition-colors ${
              language === 'si'
                ? 'text-black underline underline-offset-4'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            සිංහල
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex justify-center space-x-8 text-[17px] pb-3 -mt-10">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={link.path}
              className={`font-semibold ${
                pathname === link.path
                  ? 'text-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              {t[link.key] || link.key}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-white shadow-lg border-t text-center pb-3">
          {links.map((link) => (
            <li key={link.key} className="py-2">
              <Link
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block font-semibold ${
                  pathname === link.path
                    ? 'text-yellow-500'
                    : 'text-black hover:text-yellow-500'
                }`}
              >
                {t[link.key] || link.key}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
