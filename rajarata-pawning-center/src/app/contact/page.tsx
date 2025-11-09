'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function ContactPage() {
  const { translations } = useLanguage()
  const t = translations?.contact ?? { form: {}, details: {} }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <section className="py-16 relative z-10 mr-10 ml-10">
        <div className="container mx-auto px-6">
          {/* Title Section */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"
            >
              {t?.title || 'Contact Us'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-amber-100"
            >
              {t?.desc || 'Reach out to us for any inquiries or support.'}
            </motion.p>

            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-md"></div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-xl"
            >
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t.form?.firstName || 'First Name'}
                    className="p-3 rounded bg-transparent border border-yellow-200/40 text-white placeholder-amber-200 focus:border-yellow-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder={t.form?.lastName || 'Last Name'}
                    className="p-3 rounded bg-transparent border border-yellow-200/40 text-white placeholder-amber-200 focus:border-yellow-400 outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder={t.form?.email || 'Email'}
                  className="w-full p-3 rounded bg-transparent border border-yellow-200/40 text-white placeholder-amber-200 focus:border-yellow-400 outline-none"
                />
                <input
                  type="text"
                  placeholder={t.form?.contactNumber || 'Contact Number'}
                  className="w-full p-3 rounded bg-transparent border border-yellow-200/40 text-white placeholder-amber-200 focus:border-yellow-400 outline-none"
                />
                <textarea
                  placeholder={t.form?.message || 'Message'}
                  rows={4}
                  className="w-full p-3 rounded bg-transparent border border-yellow-200/40 text-white placeholder-amber-200 focus:border-yellow-400 outline-none"
                ></textarea>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-semibold py-3 rounded-xl shadow-lg hover:shadow-yellow-400/50 transition"
                >
                  {t.form?.submit || 'Submit'}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-yellow-300 mb-3">
                  {t.details?.officeName || 'Rajarata Pawning Center'}
                </h3>
                <p className="text-amber-100 mb-1">
                  {t.details?.address || 'Siripura, Polonnaruwa, Sri Lanka'}
                </p>
                <p className="text-amber-100">
                  {t.details?.phones || '071-2345678 / 077-9876543'}
                </p>
              </div>

              {/* Map Section */}
              <div className="p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                  {t.details?.mapTitle || 'Find Us on Google Maps'}
                </h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d323.5455596233786!2d81.01741540533706!3d7.730382254394223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb4d0902a7f06b%3A0x3ca3539acf404fa8!2sP2J8%2B5XP%2C%20Siripura!5e0!3m2!1sen!2slk!4v1762683669238!5m2!1sen!2slk"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
