"use client"
import { useEffect, useState } from 'react'

type Slide = {
  title: string
  desc: string
  image: string
}

const slides: Slide[] = [
  {
    title: '',
    desc: '',
    image: '/images/home-slider/1st.png',
  },
  {
    title: 'Fair Valuations',
    desc: 'We provide accurate, transparent appraisals for all items. Our experts carefully assess each piece based on current market value. You can trust us to offer fair prices that truly reflect your valuables.',
    image: '/images/home-slider/2nd.png',
  },
  {
    title: 'Flexible Terms',
    desc: 'Choose short or long-term pawn options that suit your financial needs. We understand that everyone’s situation is different, so our plans are designed with flexibility in mind. Redeem your items at your own pace with no hidden fees.',
    image: '/images/home-slider/3rd.png',
  },
  {
    title: 'Secure Storage',
    desc: 'Your valuables are stored in a fully monitored and insured facility. We take every measure to ensure maximum safety and confidentiality. Rest assured that your items remain protected until you decide to reclaim them.',
    image: '/images/home-slider/4th.png',
  },
  {
    title: 'Friendly Support',
    desc: 'Our experienced staff is always ready to assist you with clear guidance. We believe in building long-term relationships through honest and respectful service. From the moment you visit, you’ll feel supported every step of the way.',
    image: '/images/home-slider/5th.png',
  },
]

export default function HomePage() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <><section className="relative w-full h-screen overflow-hidden bg-linear-to-b from-yellow-300 to-white">
      {/* slides (background images) */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={i !== index} />
      ))}

      {/* overlay to darken background for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* left-side text */}
      <div className="relative z-20 max-w-3xl h-full flex items-center">
        <div className="px-6 md:px-20 lg:px-32 text-left text-white">
          <h1 className="text-[64px] md:text-[64px] font-bold leading-tight">{slides[index].title}</h1>
          <p className="mt-4 text-sm md:text-lg text-white/90 max-w-xl">{slides[index].desc}</p>
        </div>
      </div>

      {/* optional small indicators bottom-left */}
      <div className="absolute left-1/2 bottom-8 z-30 flex space-x-2 -translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-yellow-500' : 'bg-white/60'}`} />
        ))}
      </div>
    </section>
      // Alternative stronger glass effect version
      <section className="py-16 bg-linear-to-br from-blue-50 to-gray-100 -mt-20 relative z-30">
        <div className="container mx-auto px-6">

          {/* Enhanced glass morphism stats container */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[27px] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Happy Customers */}
              <div className="text-center p-8 bg-linear-to-br from-white/50 to-white/20 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-900 mb-4">10K+</div>
                <div className="text-lg text-gray-800 font-semibold">Happy Customers</div>
              </div>

              {/* Years Experience */}
              <div className="text-center p-8 bg-linear-to-br from-white/50 to-white/20 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-900 mb-4">15+</div>
                <div className="text-lg text-gray-800 font-semibold">Years Experience</div>
              </div>

              {/* Satisfaction Rate */}
              <div className="text-center p-8 bg-linear-to-br from-white/50 to-white/20 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-900 mb-4">98%</div>
                <div className="text-lg text-gray-800 font-semibold">Satisfaction Rate</div>
              </div>

              {/* Secure Storage */}
              <div className="text-center p-8 bg-linear-to-br from-white/50 to-white/20 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-900 mb-4">100%</div>
                <div className="text-lg text-gray-800 font-semibold">Secure Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* main services */}
      <section className="py-16 bg-linear-to-br from-yellow-100 to-gray-100 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Main Services</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl font-bold text-blue-900 mb-4">Gold Loans</div>
              <div className="text-lg text-gray-800 font-semibold">Quick and secure loans against gold items.</div>
            </div>

            {/* Service 2 */}
            <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl font-bold text-blue-900 mb-4">Jewelry Appraisal</div>
              <div className="text-lg text-gray-800 font-semibold">Accurate valuation for your precious jewelry.</div>
            </div>

            {/* Service 3 */}
            <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl font-bold text-blue-900 mb-4">Pawn Renewals</div>
              <div className="text-lg text-gray-800 font-semibold">Flexible renewal options for existing pawns.</div>
            </div>

            {/* Service 4 */}
            <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl font-bold text-blue-900 mb-4">Secure Storage</div>
              <div className="text-lg text-gray-800 font-semibold">Safe storage for your valuables with full insurance.</div>
            </div>
          </div>
        </div>
      </section>

      {/* branches */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-gray-100 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Branches</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 justify-center">
            {/* Branch 1 */}
            <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-2xl font-bold text-blue-900 mb-4">Siripura</div>
              <div className="text-lg text-gray-800 font-semibold">Our first branch located in Siripura.</div>
            </div>
          </div>
        </div>
      </section>

      {/* contact details */}
      <section className="py-16 bg-linear-to-br from-yellow-200 to-gray-100 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {/* Left side: Contact details */}
            <div className="p-6 bg-white backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 w-90 h-80">
              <div className="text-center">
                <span className="text-4xl text-black mb-4">📞</span>
                <h3 className="text-2xl font-bold text-gray-900">Call Us</h3>
                <p className="text-sm text-gray-600 mb-4">For more information</p>
                <p className="text-lg text-gray-800 font-semibold">076-1515169</p>
                <p className="text-lg text-gray-800 font-semibold">075-0945520</p>
                <hr className="my-4 border-red-500" />
                <a href="mailto:rcp@gmail.com" className="text-blue-600 underline">rpc@gmail.com</a>
              </div>
            </div>

            {/* Right side: Map */}
            <div className="p-6 ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d323.5455596233786!2d81.01741540533706!3d7.730382254394223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb4d0902a7f06b%3A0x3ca3539acf404fa8!2sP2J8%2B5XP%2C%20Siripura!5e0!3m2!1sen!2slk!4v1762683669238!5m2!1sen!2slk"
                width="130%"
                height="310"
                style={{ borderRadius: '15px', border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      </>
  )
}