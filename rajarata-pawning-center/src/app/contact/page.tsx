
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-yellow-50 to-white">
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">We are here to assist you. Reach out to us using the form below or find our location details.</p>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <form>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="First Name" className="p-3 border border-gray-300 rounded" />
                  <input type="text" placeholder="Last Name" className="p-3 border border-gray-300 rounded" />
                </div>
                <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded mb-4" />
                <input type="text" placeholder="Contact Number" className="w-full p-3 border border-gray-300 rounded mb-4" />
                <textarea placeholder="Message" className="w-full p-3 border border-gray-300 rounded mb-4" rows={4}></textarea>
                <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-blue-700 transition">Submit</button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rajarata Gold Loan Center</h3>
                <p className="text-gray-700">Siripura New Town, Polonnaruwa, Sri Lanka</p>
                <p className="text-gray-700">076-1515169 / 075-0945520 / 078-8722740</p>
              </div>

              {/* Map */}
              <div className="p-6 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Location</h3>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d323.5455596233786!2d81.01741540533706!3d7.730382254394223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb4d0902a7f06b%3A0x3ca3539acf404fa8!2sP2J8%2B5XP%2C%20Siripura!5e0!3m2!1sen!2slk!4v1762683669238!5m2!1sen!2slk"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}