'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/home" className="text-xl font-bold text-blue-700">
          Rajarata Pawn
        </Link>
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`${
                  pathname === link.path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
