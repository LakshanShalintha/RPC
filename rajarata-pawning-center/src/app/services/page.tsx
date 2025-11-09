
export default function ServicesPage() {
  const services = [
    { title: 'Maximum Loan Amount', description: 'Rs. 150,000' },
    { title: 'Interest Rate', description: '1% interest per month' },
    { title: 'Minimum for Pawning', description: '200 mg gold' },
    { title: 'Interest-Free Grace Period', description: 'First month (for specific types of loans)' },
    { title: 'Working Hours', description: '8:00 AM to 5:00 PM' },
    { title: 'Redemption and Renewal', description: 'Within one month' },
    { title: 'Flexible Payment Plans', description: 'Based on your requirements' },
    { title: 'Regular Customer Benefits', description: 'Special benefits available' },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-yellow-50 to-white">
      <section className="py-16 bg-linear-to-br from-yellow-50 to-white relative z-30 mr-14 ml-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">We offer a range of pawn services to meet your needs. Below are the details:</p>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-6 bg-linear-to-r from-yellow-100 to-white rounded-xl border border-yellow-300 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600">For more details, call us at:</p>
            <p className="text-lg text-blue-600 font-semibold">076-1515169 / 075-0945520 / 0788-722740</p>
          </div>
        </div>
      </section>
    </main>
  );
}