
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-yellow-50 to-white">
      <section className="py-16 mr-14 ml-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">About Us</h2>
            <p className="text-lg text-gray-600">Learn more about Rajarata Pawning Center and our commitment to serving you.</p>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Text Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">Who We Are</h3>
              <p className="text-gray-700">
                Rajarata Pawning Center has been a trusted name in the pawning industry for over 15 years. We are dedicated to providing secure, transparent, and customer-focused services to meet your financial needs.
              </p>
              <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-700">
                Our mission is to empower individuals by offering fair and flexible pawning solutions, ensuring the safety and confidentiality of your valuables.
              </p>
              <h3 className="text-3xl font-bold text-gray-900">Why Choose Us</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Trusted by thousands of customers</li>
                <li>Competitive interest rates</li>
                <li>Secure storage facilities</li>
                <li>Friendly and professional staff</li>
              </ul>
            </div>

            {/* Right Side: Image */}
            <div className="flex justify-center items-center">
              <img
                src="/images/about/about.png"
                alt="About Us"
                className="rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}