"use client";
import React, { useEffect, useState } from 'react';
console.log(process.env);

function getAppointment(id: number){
  var myHeaders = new Headers();
myHeaders.append("Content-type", "application/json");

var requestOptions = {
   method: 'GET',
   headers: myHeaders
};

fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}?q=rezervacija_sisanje`, requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
}



function isSunday(date: Date) {
  return date.getDay() === 0;
}


function formatTime(hours: number, minutes: number): string {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  const minute = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${minute} ${ampm}`;
}


const generateTimeOptions = () => {
  const options = [];
  for (let hour = 9; hour < 17; hour++) {
    options.push(formatTime(hour, 0));
    if (hour !== 16) options.push(formatTime(hour, 30));
  }
  return options;
};

const timeOptions = generateTimeOptions();


const serviceOptions = [
  "Women's Haircut",
  "Men's Haircut",
  "Men's Beard",
  "Shampoo & Blow Dry",
  "Full Hair Color",
  "Highlights",
];

const BookAppointment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const isDateValid = () => {
    if (!selectedDate) return false;
    const date = new Date(selectedDate);
    return !isSunday(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateValid()) {
      alert('Appointments cannot be booked on Sundays. Please select another date.');
      return;
    } 
    alert(`Appointment booked for a ${selectedService} on ${selectedDate} at ${selectedTime}`);
  };

  useEffect(() => {getAppointment(1)},[])

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center relative">
 
      <div className="absolute w-[24rem] h-[24rem] bg-gray-700 rounded-full left-[-12rem] top-1/2 transform -translate-y-1/2 overflow-hidden hidden lg:block"></div>
      <div className="absolute w-[24rem] h-[24rem] bg-yellow-400 rounded-full left-[8rem] top-1/2 transform -translate-y-1/2 overflow-hidden hidden lg:block"></div>
      <h1 className="text-4xl font-bold mb-6 z-10">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative z-10">
        <div className="mb-4">
          <label htmlFor="date" className="block text-lg font-medium mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full p-2 border ${isDateValid() ? 'border-gray-300' : 'border-red-500'} rounded-lg`}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          {!isDateValid() && selectedDate && (
            <p className="text-red-500 mt-2">Appointments cannot be booked on Sundays.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-lg font-medium mb-2">
            Select Time
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Select a time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="service" className="block text-lg font-medium mb-2">
            Type of Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Select a service</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition duration-200"
          disabled={!selectedDate || !selectedTime || !selectedService || !isDateValid()}
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
