"use client";
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log('Form submitted successfully');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } else {
      console.log('Error submitting form');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">
        <span className="text-black">Contact</span> <span className="text-yellow-500">Us</span>
      </h1>
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        {/* Contact Form */}
        <form className="w-full md:w-1/2 mb-6 md:mb-0" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-yellow-400"
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-yellow-400"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-yellow-400"
              id="message"
              placeholder="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
        
        {/* Location Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:ml-8">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Our Location</h2>
          <div className="w-full h-64 border-l-8 border-r-8 border-t-8 border-b-8 border-r-yellow-400 border-t-black border-l-black border-b-yellow-400 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.2023452304543!2d18.375280475668173!3d43.85163453957488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758c9137d4f8671%3A0xceaac18b4c885c60!2sMalta%201%2C%20Sarajevo%2071000!5e0!3m2!1sen!2sba!4v1723756575321!5m2!1sen!2sba"
              width="100%"
              height="100%"
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
              className="border-0 shadow-lg rounded-lg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
