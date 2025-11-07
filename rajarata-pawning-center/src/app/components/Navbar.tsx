 'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const [menuOpen, setMenuOpen] = useState(false)

  const [activeLang, setActiveLang] = useState<'english' | 'sinhala'>('english')
  

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center py-4 px-4 md:px-20">
        {/* Logo (hidden on small screens) */}
        <Link href="/home" className="hidden md:block text-3xl font-bold text-yellow-500 mr-4 md:mr-6">
          Rajarata Pawn
        </Link>

        {/* Mobile menu button (visible on small screens) */}
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

        {/* Navigation Links (desktop) */}
        <ul className="hidden md:flex flex-1 justify-center space-x-8 text-[17px]">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`font-semibold ${
                  pathname === link.path
                    ? 'text-yellow-500' // active
                    : 'text-black hover:text-yellow-500' // default
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

    {/* Language Buttons (right side on all screens) */}
    <div className="ml-auto flex space-x-3">
      <button
        onClick={() => setActiveLang('english')}
        className={`text-[10px] font-semibold transition-colors ${
          activeLang === 'english'
            ? 'underline underline-offset-4'
            : 'text-black'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setActiveLang('sinhala')}
        className={`text-[10px] font-semibold transition-colors ${
          activeLang === 'sinhala'
            ? 'underline underline-offset-4'
            : 'text-black'
        }`}
      >
        සිංහල
      </button>
    </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 border-t border-gray-100">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block w-full text-center py-2 font-semibold ${
                pathname === link.path ? 'text-yellow-500' : 'text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* language buttons moved to top bar for mobile */}
        </div>
      </div>
      </div>
    </nav>
  )
}
