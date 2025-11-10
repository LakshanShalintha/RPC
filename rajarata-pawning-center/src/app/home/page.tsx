'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function HomePage() {
  const { translations } = useLanguage()
  const t = translations.home || {}
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      if (t.slides?.length) {
        setIndex((i) => (i + 1) % t.slides.length)
      }
    }, 4000)
    return () => clearInterval(id)
  }, [t.slides?.length])

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero Section with Split Layout */}
      <section className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white px-6 py-12 md:py-0 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 mx-0 lg:mx-14">
          {/* Left Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Instant Cash for Your Valuables. <br className="hidden md:block" /> Quick, Easy, Secure.
            </h1>
            <p className="text-base sm:text-lg mb-6 mt-4 text-amber-100">
              Get a free online estimate or visit one of our conveniently located centers.
            </p>

            {/* Icons Section */}
            <div className="flex flex-wrap justify-center md:justify-start mt-8 gap-4">
              {[
                { src: '/images/home-card/ring.png', label: 'Ring' },
                { src: '/images/home-card/necklace.png', label: 'Necklace' },
                { src: '/images/home-card/bracelet.png', label: 'Bracelet' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center w-24 h-24 p-4 bg-white/10 backdrop-blur-md border border-yellow-300/30 rounded-2xl shadow-lg hover:scale-105 hover:bg-white/20 transition-transform"
                >
                  <img src={item.src} alt={item.label} className="w-12 h-12 mb-2 object-contain" />
                  <p className="text-sm font-semibold text-white text-center">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Slider */}
          <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-[420px] relative mt-8 md:mt-0 rounded-2xl overflow-hidden">
            {t.slides?.map((s: { image?: string }, i: number) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 rounded-2xl shadow-lg ${
                  i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
                  backgroundImage: `url(${s.image || `/images/home-slider/${i + 1}.png`})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            ))}
          </div>
        </div>
      </section>


        {/* Stats */}
        <section className="py-16 relative z-30 mx-0 lg:mx-14">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-3xl p-10 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {t.stats?.map(
                  (s: { value: React.ReactNode; label: React.ReactNode }, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-8 bg-white/10 rounded-2xl border border-yellow-300/30 shadow-lg"
                    >
                      <div className="text-5xl font-extrabold text-yellow-300 mb-2">
                        {s.value}
                      </div>
                      <div className="text-lg text-amber-100 font-semibold">
                        {s.label}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </section>

      {/* Main Services */}
      <section className="py-20 relative z-30 mx-0 lg:mx-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-yellow-300 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
              {t.mainServicesTitle || 'Our Main Services'}
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full shadow-md"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.mainServices?.map(
              (s: { title: React.ReactNode; desc: React.ReactNode }, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 text-center bg-white/10 backdrop-blur-lg border border-yellow-300/30 rounded-2xl shadow-xl hover:shadow-yellow-400/30 transition"
                >
                  <div className="text-2xl font-bold text-yellow-300 mb-2">
                    {s.title}
                  </div>
                  <div className="text-amber-100">{s.desc}</div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 relative z-30 mx-0 lg:mx-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-yellow-300 mb-4">
              {t.branchesTitle || 'Our Branches'}
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full shadow-md"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {t.branches?.map(
              (b: { title: React.ReactNode; desc: React.ReactNode }, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="text-center p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-lg"
                >
                  <div className="text-2xl font-bold text-yellow-300 mb-3">
                    {b.title}
                  </div>
                  <div className="text-amber-100">{b.desc}</div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-20 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-yellow-300 mb-4">
              {t.contact?.title || 'Contact Us'}
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full shadow-md"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-xl w-[320px] text-center">
              <span className="text-4xl mb-1 block">📞</span>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                {t.contact?.callUs || 'අමතන්න'}
              </h3>
              <p className="text-amber-100 mb-4">
                {t.contact?.info || 'වැඩි විස්තර සඳහා'}
              </p>
              <p className="text-lg text-white font-semibold">{t.contact?.phone1 || 'Not Available'}</p>
              <p className="text-lg text-white font-semibold">{t.contact?.phone2 || 'Not Available'}</p>
              <hr className="my-4 border-yellow-300" />
              <a
                href={`mailto:${t.contact?.email || 'info@example.com'}`}
                className="text-yellow-300 underline hover:text-amber-200"
              >
                {t.contact?.email || 'info@example.com'}
              </a>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden border border-yellow-300/30 shadow-xl"
            >
              <div className="w-full md:w-[450px] h-[300px] rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d323.5455596233786!2d81.01741540533706!3d7.730382254394223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb4d0902a7f06b%3A0x3ca3539acf404fa8!2sP2J8%2B5XP%2C%20Siripura!5e0!3m2!1sen!2slk!4v1762683669238!5m2!1sen!2slk"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
