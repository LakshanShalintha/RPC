'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function AboutPage() {
  const { translations } = useLanguage()
  const t = translations.about || {}

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <section className="py-16 relative z-10 mx-0 lg:mx-14">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"
            >
              {t.title || 'About Rajarata Pawn'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-amber-100"
            >
              {t.desc || 'Dedicated to providing fair, transparent and trusted pawning services for everyone.'}
            </motion.p>

            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-md"></div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side – Text Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 p-8 rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-2">
                  {t.whoWeAreTitle || 'Who We Are'}
                </h3>
                <p className="text-amber-100 leading-relaxed">
                  {t.whoWeAreDesc ||
                    'Rajarata Pawn is a trusted pawning center serving the community with honesty and reliability. We offer secure, fair evaluations and personalized services for your valuable assets.'}
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-2">
                  {t.ourMissionTitle || 'Our Mission'}
                </h3>
                <p className="text-amber-100 leading-relaxed">
                  {t.ourMissionDesc ||
                    'Our mission is to provide easy access to financial support while maintaining the highest level of transparency, security, and trust.'}
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-3">
                  {t.whyChooseUsTitle || 'Why Choose Us'}
                </h3>
                <ul className="list-disc list-inside text-amber-100 space-y-2">
                  {(t.whyChooseUsList || [
                    'Trusted evaluations by professionals',
                    'Quick and secure transactions',
                    'Confidential and reliable services',
                  ]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Side – Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-stretch h-full"
            >
              <div className="relative w-full h-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-2xl blur-lg opacity-40"></div>
                <img
                  src="/images/about/about.png"
                  alt={t.title}
                  className="relative rounded-2xl border border-yellow-300/20 shadow-2xl backdrop-blur-lg transform hover:scale-105 transition-transform duration-500 w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
