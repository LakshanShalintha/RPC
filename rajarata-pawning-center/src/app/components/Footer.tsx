'use client'

import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { translations } = useLanguage()
  const t = translations.footer || {} // Add a "footer" section in your JSON
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white pt-16">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 md:px-20 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 items-center text-center md:items-start md:text-left">
          
          {/* Company Info */}
          <div className="md:flex-1">
            <h3 className="text-xl md:text-3xl font-bold text-yellow-300">{t.companyName || 'Rajarata Gold Loan Center'}</h3>
            <p className="mt-4 text-sm text-amber-100">{t.description || 'Trusted pawning services in the Rajarata region.'}</p>

            <div className="mt-4 text-sm text-amber-100 space-y-1">
              <p>
                <a href={`mailto:${t.email || 'rpc@gmail.com'}`} className="hover:text-yellow-400">
                  {t.email || 'rpc@gmail.com'}
                </a>
              </p>
              <p>{t.addressLine1 || 'Siripura New Town,'}</p>
              <p>{t.addressLine2 || 'Polonnaruwa, Sri Lanka.'}</p>
            </div>
          </div>

          {/* Pages Links */}
          <div className="md:w-60 md:ml-auto mx-auto text-center md:mx-0 md:text-right">
            <h4 className="text-[22px] font-semibold text-yellow-300">{t.pagesTitle || 'Pages'}</h4>
            <ul className="mt-4 space-y-2 text-amber-100 text-center md:text-right">
              <li>
                <Link href="/home" className="hover:text-yellow-400">{t.pages?.home || 'Home'}</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-400">{t.pages?.services || 'Services'}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-400">{t.pages?.about || 'About'}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400">{t.pages?.contact || 'Contact'}</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-yellow-700/40" />

        <div className="flex flex-col md:flex-row items-center md:justify-between text-center -mt-4 mb-2">
          <p className="text-sm text-amber-100">© {year} {t.copyright || 'Rajarata Pawning Center'}. {t.rights || 'All rights reserved.'}</p>

          <div className="md:mt-0 flex items-center space-x-3 justify-center md:justify-end">
            {/* Social Icons */}
            <a href={t.social?.facebook || '#'} aria-label="facebook" className="text-amber-100 hover:text-yellow-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07C2 17.09 5.66 21.13 10.44 21.9v-6.99H7.9v-2.84h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.54v1.86h2.74l-.44 2.84h-2.3V21.9C18.34 21.13 22 17.09 22 12.07z" />
              </svg>
            </a>
            <a href={t.social?.instagram || '#'} aria-label="instagram" className="text-amber-100 hover:text-yellow-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.5" />
                <path d="M17.5 6.5h.01" strokeWidth="1.5" />
              </svg>
            </a>
            <a href={t.social?.location || '#'} aria-label="location" className="text-amber-100/90 hover:text-yellow-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
