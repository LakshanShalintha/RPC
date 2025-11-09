import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white text-black -mt-5">
      <div className="container mx-auto px-4 md:px-20 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 items-center text-center md:items-start md:text-left">
          <div className="md:flex-1">
            <h3 className="text-xl md:text-3xl font-bold text-yellow-500">Rajarata Gold Loan Center</h3>
            <p className="mt-4 text-sm text-black">Trusted pawning services in the Rajarata region.</p>

            <div className="mt-4 text-sm text-black space-y-1">
              <p>
                <a href="mailto:rcp@gmail.com" className="hover:text-yellow-500">
                  rpc@gmail.com
                </a>
              </p>
              <p>Siripura New Town,</p>
              <p>Polonnaruwa, Sri Lanka.</p>
            </div>
          </div>

          <div className="md:w-60 md:ml-auto mx-auto text-center md:mx-0 md:text-right">
            <h4 className="text-[22px] font-semibold text-yellow-500">Pages</h4>
            <ul className="mt-4 space-y-2 text-black text-center md:text-right">
              <li>
                <Link href="/home" className="hover:text-yellow-500">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-500">Services</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-500">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

  <hr className="my-6 border-gray-200" />

  <div className="flex flex-col md:flex-row items-center md:justify-between text-center">
    <p className="text-sm">© {year} Rajarata Pawning Center. All rights reserved.</p>

    <div className="mt-4 md:mt-0 flex items-center space-x-3 justify-center md:justify-end">
            <a href="#" aria-label="facebook" className="text-black hover:text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07C2 17.09 5.66 21.13 10.44 21.9v-6.99H7.9v-2.84h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.54v1.86h2.74l-.44 2.84h-2.3V21.9C18.34 21.13 22 17.09 22 12.07z" />
              </svg>
            </a>
            <a href="#" aria-label="instagram" className="text-black hover:text-yellow-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.5" />
                <path d="M17.5 6.5h.01" strokeWidth="1.5" />
              </svg>
            </a>
            <a href="#" aria-label="location" className="text-black/90 hover:text-yellow-500">
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
