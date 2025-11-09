"use client"
import { useEffect, useState } from 'react'

type Slide = {
  title: string
  desc: string
  image: string
}

const slides: Slide[] = [
  {
    title: 'Trusted Pawning Services',
    desc: 'Fast, secure, and confidential pawning for your valuables.',
    image: '/images/img1.png',
  },
  {
    title: 'Fair Valuations',
    desc: 'We provide accurate, transparent appraisals for all items.',
    image: '/images/slide2.svg',
  },
  {
    title: 'Flexible Terms',
    desc: 'Short and long term pawn options tailored to your needs.',
    image: '/images/slide3.svg',
  },
  {
    title: 'Secure Storage',
    desc: 'All items are stored securely with full insurance coverage.',
    image: '/images/slide4.svg',
  },
  {
    title: 'Friendly Support',
    desc: 'Our staff are available to guide you through the process.',
    image: '/images/slide5.svg',
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
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{slides[index].title}</h1>
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

      {/* New section for main services */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-gray-100 relative z-30">
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

      {/* New section for branches */}
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

      {/* Updated section for contact details */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-gray-100 relative z-30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {/* Left side: Contact details */}
            <div className="p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 w-90 h-80">
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
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d247.09736910462456!2d81.01751559898275!3d7.730488118079183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1762672083542!5m2!1sen!2slk"
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