import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Big Circle */}
      <div className="absolute w-[24rem] h-[24rem] bg-yellow-400 rounded-full right-[-12rem] top-1/2 transform -translate-y-1/2"></div>
      
      {/* Small Circles */}
      <div className="absolute w-[2rem] h-[2rem] bg-yellow-400 rounded-full left-20 top-1/2 transform -translate-y-1/2"></div>
      <div className="absolute w-[3rem] h-[3rem] bg-gray-700 rounded-full left-10 top-1/6 transform -translate-y-1/2"></div>
      <div className="absolute w-[4rem] h-[4rem] bg-yellow-400 rounded-full left-[5rem] top-[22%] transform -translate-y-1/2"></div>
      <div className="absolute w-[2rem] h-[2rem] bg-yellow-400 rounded-full left-20 top-1/3 transform -translate-y-1/2"></div>
      <div className="absolute w-[2.25rem] h-[2.25rem] bg-gray-700 rounded-full left-10 top-1/4 transform -translate-y-1/2"></div>
      <div className="absolute w-[24rem] h-[24rem] bg-gray-700 rounded-full right-[8rem] top-1/2 transform -translate-y-1/2"></div>
      

      <div className="relative z-10 flex flex-col items-center lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 p-8 rounded-lg">
        <div className="text-center lg:text-left max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Bella</h1>
          <p className="text-lg text-gray-600 mt-2">
            Explore our services and book your appointment now
          </p>
          <Link href="/booking" className="mt-4 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors">
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
    </div>
  );
}
