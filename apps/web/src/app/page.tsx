import React from 'react';
import Link from 'next/link';

export default function CombinedPage() {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      {/* Home page section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Big circle */}
        <div className="absolute w-[24rem] h-[24rem] bg-yellow-400 rounded-full right-[-12rem] top-1/2 transform -translate-y-1/2"></div>

        {/* Small circles */}
        <div className="absolute w-[2rem] h-[2rem] bg-yellow-400 rounded-full left-20 top-1/2 transform -translate-y-1/2"></div>
        <div className="absolute w-[3rem] h-[3rem] bg-gray-700 rounded-full left-10 top-1/6 transform -translate-y-1/2"></div>
        <div className="absolute w-[4rem] h-[4rem] bg-yellow-400 rounded-full left-[5rem] top-[22%] transform -translate-y-1/2"></div>
        <div className="absolute w-[2rem] h-[2rem] bg-yellow-400 rounded-full left-20 top-1/3 transform -translate-y-1/2"></div>
        <div className="absolute w-[2.25rem] h-[2.25rem] bg-gray-700 rounded-full left-10 top-1/4 transform -translate-y-1/2"></div>
        <div className="absolute w-[24rem] h-[24rem] bg-gray-700 rounded-full right-[8rem] top-1/2 transform -translate-y-1/2 md:mt-4"></div>

        <div className="relative z-10 flex flex-col items-center lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 md:mt-20 p-8 rounded-lg">
          <div className="text-center lg:text-left max-w-lg">
          <h1 className="hidden lg:block text-3xl md:text-4xl lg:text-5xl lg:ml-40 font-bold text-gray-800">Bella</h1>
            <div className="relative">
              <div className="absolute inset-0 bg-black opacity-50 rounded-md lg:hidden md:hidden"></div>
              <p className="text-lg text-white md:text-gray-600 mt-2 lg:pl-20 md:ml-10 relative z-10">
                Explore our services and book your appointment now
              </p>
            </div>

            <Link href="/booking" className="mt-4 lg:ml-40 md:mt-2 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors">
              Book now
            </Link>
          </div>

          <div className="relative max-w-xl h-auto">
            <img
              src="images/background.png"
              alt="Service"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* About us section (small screens only) */}
      <section className="container mx-auto p-8 bg-gray-100 mt-12 lg:hidden">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg leading-relaxed mb-4">
          Welcome to Bella, your go-to hair salon in Sarajevo! Established in 2016,
          Bella was founded with a simple mission: to make our clients feel beautiful
          and confident. Over the years, we’ve built a reputation for offering top-notch
          hair services in a warm, welcoming environment.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Our company was founded in 2016 with a vision to make a difference in the
          industry. Over the years, we have grown into a reputable organization known
          for our commitment to excellence and customer satisfaction.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          We believe in the power of innovation and continuous improvement.
        </p>
        <p className="text-lg leading-relaxed">
          Thank you for taking the time to learn more about us. <br />
          We look forward to working with you and achieving great things together.
        </p>

        <div className="mt-12 mb-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          <div className="absolute inset-0 bg-black opacity-10 w-full h-full rounded-lg -translate-x-4 translate-y-4"></div>
          <div className="relative">
            <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-400 rounded-full -translate-x-8 -translate-y-8"></div>
            <img
              src="/images/klijent_slika_3.jpg"
              alt="Client 3"
              className="w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover rounded-lg shadow-lg relative z-10"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <div className="relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-700 rounded-full translate-x-8 -translate-y-8"></div>
            <img
              src="/images/klijent_slika_4.jpg"
              alt="Client 4"
              className="w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover rounded-lg shadow-lg relative z-10"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <div className="relative">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full -translate-x-8 translate-y-8"></div>
            <img
              src="/images/klijent_slika_2.jpg"
              alt="Client 5"
              className="w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover rounded-lg shadow-lg relative z-10"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <div className="relative">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-700 rounded-full translate-x-8 translate-y-8"></div>
            <img
              src="/images/klijent_slika_5.jpg"
              alt="Client 5"
              className="w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover rounded-lg shadow-lg relative z-10"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
      </section>

      {/* Service table section (small screens only) */}
      <section className="container mx-auto p-8 bg-gray-100 mt-12 lg:hidden">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Services <span className="text-yellow-500">&</span> Prices
        </h2>
        <div className="max-w-xl mx-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gradient-to-b from-gray-50 to-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="text-left p-4 font-semibold text-lg">Service</th>
                  <th className="text-right p-4 font-semibold text-lg">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Women's Haircut", price: '30KM' },
                  { name: "Men's Haircut", price: '10KM' },
                  { name: "Men's Beard", price: '5KM' },
                  { name: 'Shampoo & Blow Dry', price: '10KM' },
                  { name: 'Full Hair Color', price: '40KM' },
                  { name: 'Highlights', price: '10KM' },
                ].map((service, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
                    } hover:bg-yellow-100 transition-colors`}
                  >
                    <td className="p-4 text-gray-800 font-medium">
                      {service.name}
                    </td>
                    <td className="p-4 text-right text-gray-800 font-medium">
                      {service.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="container mx-auto p-8 bg-gray-100 mt-12 text-center lg:hidden">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Got a question?
        </h2>
        <Link href="/contact" className="inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors">
            Contact Us
        </Link>
      </section>
    </div>
  );
}
