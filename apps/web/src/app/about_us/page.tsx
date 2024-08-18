import React from 'react';

export default function About() {
  return (
    <section className="container mx-auto p-8 bg-gray-100">
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

    
      <div className="mt-12 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        <div className="absolute inset-0 bg-black opacity-10 w-full h-full rounded-lg -translate-x-4 translate-y-4"></div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-400 rounded-full -translate-x-8 -translate-y-8"></div>
          <img
            src="/images/klijent_slika_3.jpg"
            alt="Client 3"
            className="w-full h-80 object-cover rounded-lg shadow-lg relative z-10"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <div className="relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-700 rounded-full translate-x-8 -translate-y-8"></div>
          <img
            src="/images/klijent_slika_4.jpg"
            alt="Client 4"
            className="w-full h-80 object-cover rounded-lg shadow-lg relative z-10"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <div className="relative">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full -translate-x-8 translate-y-8"></div>
          <img
            src="/images/klijent_slika_2.jpg"
            alt="Client 5"
            className="w-full h-80 object-cover rounded-lg shadow-lg relative z-10"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <div className="relative">
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-700 rounded-full translate-x-8 translate-y-8"></div>
          <img
            src="/images/klijent_slika_5.jpg"
            alt="Client 3 (Again)"
            className="w-full h-80 object-cover rounded-lg shadow-lg relative z-10"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </div>
    </section>
  );
}
