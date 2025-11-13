'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { NewsService } from '@/lib/newsService'
import type { News } from '@/lib/supabase'

export default function NewsPage() {
  const { language, translations } = useLanguage()
  const t = translations?.news || {}
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedNews, setExpandedNews] = useState<number | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const fetchedNews = await NewsService.getAllNews()
      setNews(fetchedNews)
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
              {t.title || 'Latest News'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-amber-100"
            >
              {t.desc || 'Stay updated with the latest announcements and news from Rajarata Pawning Center.'}
            </motion.p>

            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-md"></div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
              <p className="text-amber-100 text-lg mt-4">{t.loading || 'Loading news...'}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100 text-lg">{t.noNews || 'No news available at the moment.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl border border-yellow-300/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group"
                >
                  {/* News Image */}
                  <div className="relative h-48 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 overflow-hidden">
                    {item.image_url ? (
                      <>
                        <img 
                          src={item.image_url} 
                          alt={language === 'si' ? item.title_si : item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-20 h-20 text-yellow-300/30 group-hover:text-yellow-300/50 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </>
                    )}
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      {formatDate(item.date)}
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-3 line-clamp-2 group-hover:text-yellow-200 transition-colors">
                      {language === 'si' ? item.title_si : item.title}
                    </h3>
                    
                    <p className="text-amber-100 text-sm leading-relaxed mb-4 line-clamp-3">
                      {language === 'si' ? item.description_si : item.description}
                    </p>

                    <button
                      onClick={() => setExpandedNews(expandedNews === item.id ? null : item.id)}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm flex items-center gap-2 transition-all group-hover:gap-3"
                    >
                      {t.readMore || 'Read More'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Expanded News Modal */}
          {expandedNews !== null && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setExpandedNews(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#2a1d0b] to-[#1f1508] border-2 border-yellow-300/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setExpandedNews(null)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {(() => {
                  const selectedNews = news.find(n => n.id === expandedNews)
                  if (!selectedNews) return null

                  return (
                    <>
                      {/* News Image in Modal */}
                      {selectedNews.image_url && (
                        <div className="mb-6 rounded-xl overflow-hidden">
                          <img 
                            src={selectedNews.image_url} 
                            alt={language === 'si' ? selectedNews.title_si : selectedNews.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                          {formatDate(selectedNews.date)}
                        </span>
                      </div>

                      <h2 className="text-3xl font-bold text-yellow-300 mb-6">
                        {language === 'si' ? selectedNews.title_si : selectedNews.title}
                      </h2>

                      <p className="text-amber-100 leading-relaxed text-lg">
                        {language === 'si' ? selectedNews.description_si : selectedNews.description}
                      </p>
                    </>
                  )
                })()}
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
