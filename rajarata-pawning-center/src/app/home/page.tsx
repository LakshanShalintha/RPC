'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { SliderService } from '@/lib/sliderService'
import { BranchService } from '@/lib/branchService'
import { Slider, Branch } from '@/lib/supabase'

export default function HomePage() {
  const { translations, language } = useLanguage()
  const t = translations.home || {}
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState<Slider[]>([])
  const [loadingSliders, setLoadingSliders] = useState<boolean>(true)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loadingBranches, setLoadingBranches] = useState<boolean>(true)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [showBranchPopup, setShowBranchPopup] = useState(false)

  // Fetch sliders from Supabase
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await SliderService.getAllSliders()
        if (data && data.length > 0) {
          setSlides(data)
        } else {
          // Fallback to static images if no sliders in database
          setSlides(t.slides || [])
        }
      } catch (error) {
        console.error('Error loading sliders:', error)
        // Fallback to static images on error
        setSlides(t.slides || [])
      } finally {
        setLoadingSliders(false)
      }
    }

    fetchSliders()
  }, [t.slides])

  // Fetch branches from Supabase
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await BranchService.getAllBranches()
        if (data && data.length > 0) {
          setBranches(data)
        } else {
          // Fallback to static branches if no data in database
          setBranches(t.branches || [])
        }
      } catch (error) {
        console.error('Error loading branches:', error)
        // Fallback to static branches on error
        setBranches(t.branches || [])
      } finally {
        setLoadingBranches(false)
      }
    }

    fetchBranches()
  }, [t.branches])

  useEffect(() => {
    const id = setInterval(() => {
      if (slides.length) {
        setIndex((i) => (i + 1) % slides.length)
      }
    }, 4000)
    return () => clearInterval(id)
  }, [slides.length])

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
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"> {t.title || 'Instant Cash for Your Valuables.'}
               <br className="hidden md:block" /> {t.brtitle || 'Quick, Easy, Secure.'}
            </h1>
            <p className="text-base sm:text-lg mb-6 mt-4 text-amber-100"> {t.subtitle || 'Get a free online estimate or visit one of our conveniently located centers.'}      
            </p>

            {/* Icons Section */}
            <div className="flex flex-wrap justify-center md:justify-start mt-8 gap-4">
              {[
                { src: '/images/home-card/ring.png', label: t.title_img1 || 'Ring' },
                { src: '/images/home-card/necklace.png', label: t.title_img2 || 'Necklace' },
                { src: '/images/home-card/bracelet.png', label: t.title_img3 || 'Bracelet' },
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
            {loadingSliders ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : slides.length > 0 ? (
              slides.map((slide, i) => (
                <div
                  key={slide.id || i}
                  className={`absolute inset-0 transition-opacity duration-1000 rounded-2xl shadow-lg ${
                    i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{
                    backgroundImage: `url(${slide.image_url || `/images/home-slider/${i + 1}.png`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-2xl">
                <p className="text-amber-200">No slider images available</p>
              </div>
            )}
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
            <h2 className="text-5xl font-extrabold text-yellow-300 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
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
            <h2 className="text-5xl font-extrabold text-yellow-300 mb-4">
              {t.branchesTitle || 'Our Branches'}
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full shadow-md"></div>
          </div>

          {loadingBranches ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100 text-lg">No branches available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
              {branches.map((branch) => (
                <motion.div
                  key={branch.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    setSelectedBranch(branch)
                    setShowBranchPopup(true)
                  }}
                  className="text-center p-8 bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl shadow-lg cursor-pointer transition-all hover:border-yellow-300/60"
                >
                  <div className="text-2xl font-bold text-yellow-300 mb-3">
                    {language === 'si' ? (branch.title_si || branch.title) : branch.title}
                  </div>
                  <div className="text-amber-100">
                    {language === 'si' ? (branch.description_si || branch.description) : branch.description}
                  </div>
                  <div className="mt-4 text-sm text-yellow-400">
                    {language === 'si' ? 'විස්තර සඳහා ක්ලික් කරන්න' : 'Click for details'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-20 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-extrabold text-yellow-300 mb-4">
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

      {/* Branch Details Popup */}
      {showBranchPopup && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowBranchPopup(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#2a1d0b] to-[#1f1508] border-2 border-yellow-300/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowBranchPopup(false)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Branch Title */}
            <h2 className="text-3xl font-bold text-yellow-300 mb-6 pr-12">
              {language === 'si' ? (selectedBranch.title_si || selectedBranch.title) : selectedBranch.title}
            </h2>

            {/* Branch Description */}
            {(selectedBranch.description || selectedBranch.description_si) && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  {language === 'si' ? 'විස්තරය' : 'Description'}
                </h3>
                <p className="text-amber-100">
                  {language === 'si' ? (selectedBranch.description_si || selectedBranch.description) : selectedBranch.description}
                </p>
              </div>
            )}

            {/* Address */}
            {(selectedBranch.address || selectedBranch.address_si) && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {language === 'si' ? 'ලිපිනය' : 'Address'}
                </h3>
                <p className="text-amber-100">
                  {language === 'si' ? (selectedBranch.address_si || selectedBranch.address) : selectedBranch.address}
                </p>
              </div>
            )}

            {/* Contact Number */}
            {selectedBranch.contact_number && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {language === 'si' ? 'දුරකථන අංකය' : 'Contact Number'}
                </h3>
                <a href={`tel:${selectedBranch.contact_number}`} className="text-amber-100 hover:text-yellow-300 transition-colors">
                  {selectedBranch.contact_number}
                </a>
              </div>
            )}

            {/* Google Maps */}
            {selectedBranch.map_url && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {language === 'si' ? 'ස්ථානය' : 'Location'}
                </h3>
                <div className="rounded-xl overflow-hidden border border-yellow-300/30">
                  <iframe
                    src={selectedBranch.map_url}
                    className="w-full h-[300px] border-0"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </main>
  )
}
