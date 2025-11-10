'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function ServicesPage() {
  const { translations } = useLanguage()
  const t = translations?.services || {}

  // Determine animation direction based on index and grid column
  const getEntranceVariant = (index: number) => {
    const column = index % 3 // Assuming 3-column grid
    switch (column) {
      case 0:
        return { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } } // left
      case 1:
        return { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } } // middle
      case 2:
        return { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } } // right
      default:
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white">
      {/* Glowing background highlights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <section className="py-16 relative z-10 mx-0 lg:mx-14">
        <div className="container mx-auto px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4">
              {t.title || 'Our Gold Services'}
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-amber-100"
            >
              {t.desc || 'Trusted, transparent and fast pawning for your valuables.'}
            </motion.p>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-md"></div>
          </motion.div>

          {/* Glass cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {t.list?.map((service: any, index: number) => (
              <motion.div
                key={index}
                variants={getEntranceVariant(index)}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: '0px 0px 35px rgba(255, 215, 0, 0.4)',
                  transition: { duration: 0.3, ease: 'easeInOut' },
                }}
                whileTap={{ scale: 1.05 }}
                className="p-8 rounded-2xl border border-yellow-200/30 bg-white/10 backdrop-blur-xl shadow-2xl transition-transform"
              >
                <h3 className="text-2xl font-semibold text-yellow-300 mb-2">
                  {service.title}
                </h3>
                <p className="text-amber-100">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-16 p-8 rounded-2xl border border-yellow-300/30 bg-white/10 backdrop-blur-xl shadow-xl"
          >
            <p className="text-lg text-amber-100 mb-2">
              {t.contactText || 'For inquiries, contact us:'}
            </p>
            <p className="text-lg text-yellow-300 font-semibold">
              {t.contactNumbers || '071-2345678 / 077-9876543'}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
