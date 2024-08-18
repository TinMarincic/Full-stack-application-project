import React from 'react';

interface Service {
  name: string;
  price: string;
}

const services: Service[] = [
  { name: "Women's Haircut", price: '30KM' },
  { name: "Men's Haircut", price: '10KM' },
  { name: "Men's Beard", price: '5KM' },
  { name: 'Shampoo & Blow Dry', price: '10KM' },
  { name: 'Full Hair Color', price: '40KM' },
  { name: 'Highlights', price: '10KM' },
];

export default function ServicePriceTable() {
  return (
    <div className="container mx-auto p-8 bg-gray-100">
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
              {services.map((service, index) => (
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
    </div>
  );
}

