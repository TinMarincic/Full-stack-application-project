import React from 'react';

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/saloon_background.jpg')" }}
    > <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Welcome to Bella
        </h1>
      </div>
    </div>
  );
}
