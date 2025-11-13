'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'
import { ServiceService } from '@/lib/serviceService'
import type { Service } from '@/lib/supabase'

export default function ServicesPage() {
  const { language, translations } = useLanguage()
  const t = translations?.services || {}
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const data = await ServiceService.getAllServices()
    setServices(data)
    setLoading(false)
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Show database services if available, otherwise show JSON services as fallback */}
            {(!loading && services.length > 0
              ? services.map((service: Service, index: number) => {
                  console.log(`Rendering service ${index + 1}:`, service.title)
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      className="p-8 rounded-2xl border border-yellow-200/30 bg-white/10 backdrop-blur-xl shadow-2xl"
                    >
                      <h3 className="text-2xl font-semibold text-yellow-300 mb-2">
                        {language === 'si' ? service.title_si : service.title}
                      </h3>
                      <p className="text-amber-100">
                        {language === 'si' ? service.description_si : service.description}
                      </p>
                    </motion.div>
                  )
                })
              : t.list?.map((service: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="p-8 rounded-2xl border border-yellow-200/30 bg-white/10 backdrop-blur-xl shadow-2xl"
                  >
                    <h3 className="text-2xl font-semibold text-yellow-300 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-amber-100">{service.description}</p>
                  </motion.div>
                ))
            )}
          </div>

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
