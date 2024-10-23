"use client";
import React, { useState } from "react";
import { book_appointment } from "./booking";

function isSunday(date: Date) {
  return date.getDay() === 0;
}

const serviceOptions = {
  woman: ["Women's Haircut", "Shampoo Blow Dry", "Full Hair Color", "Highlights"],
  man: ["Men's Haircut", "Men's Beard"],
  child: ["Children's Haircut"],
};

const serviceDurations: { [key: string]: number } = {
  "Women's Haircut": 45,
  "Shampoo Blow Dry": 30,
  "Full Hair Color": 120,
  "Highlights": 90,
  "Men's Haircut": 30,
  "Men's Beard": 20,
  "Children's Haircut": 20,
};

const BookAppointment: React.FC = () => {
  const [gender_age, setGender_Age] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string>("");

  const filteredServices =
    gender_age === "woman"
      ? serviceOptions.woman
      : gender_age === "man"
      ? serviceOptions.man
      : gender_age === "child"
      ? serviceOptions.child
      : [];

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const handleGender_AgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender_Age(e.target.value);
    setSelectedServices([]);
    setAvailableTimes([]);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateValue = e.target.value;
    const date = new Date(selectedDateValue);

    if (isSunday(date)) {
      setSelectedDate("");
      setDateError("Appointments cannot be booked on Sundays.");
    } else {
      setSelectedDate(selectedDateValue);
      setDateError("");
      if (selectedServices.length > 0) {
        await fetchAvailableTimes(selectedDateValue, selectedServices);
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleServiceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const service = e.target.value;
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];

    setSelectedServices(updatedServices);

    if (selectedDate && updatedServices.length > 0) {
      await fetchAvailableTimes(selectedDate, updatedServices);
    } else {
      setAvailableTimes([]); 
    }
  };

  const fetchAvailableTimes = async (date: string, services: string[]) => {
    if (services.length === 0) return; 

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/get-free-time?date=${date}&services=${services.join(",")}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching available times: ${response.statusText}`);
      }
      const freeTimes = await response.json();
      setAvailableTimes(freeTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    if (selectedServices.length === 0) {
      setErrorMessage("Please select at least one service.");
      setStatus("error");
      return;
    }

    if (!selectedTime) {
      setErrorMessage("Please select a time.");
      setStatus("error");
      return;
    }

    try {
      const [timeString, period] = selectedTime.split(" ");
      const [hours, minutes] = timeString.split(":").map(Number);

      let adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
      if (period === "AM" && hours === 12) adjustedHours = 0;

      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(adjustedHours, minutes);

      const totalDuration = selectedServices.reduce(
        (acc, service) => acc + serviceDurations[service],
        0
      );
      const endTime = new Date(dateWithTime);
      endTime.setMinutes(endTime.getMinutes() + totalDuration);

      const formData = {
        email,
        date: new Date(selectedDate),
        time: dateWithTime,
        end_time: endTime,
        service_type: selectedServices,
      };

      const response = await book_appointment(formData);

      if (response?.error) {
        setErrorMessage(response.error);
        setStatus("error");
      } else {
        setStatus("success");

        setGender_Age("");
        setEmail("");
        setSelectedDate("");
        setAvailableTimes([]);
        setSelectedTime("");
        setSelectedServices([]);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Error submitting the form. Please try again.");
      console.error("Form submission error:", error);
    }
  };
  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center relative">
      <h1 className="text-4xl font-bold mb-6 z-10">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative z-10">
        <div className="mb-4">
          <label htmlFor="gender_age" className="block text-lg font-medium mb-2">
            Gender and Age
          </label>
          <select
            id="gender_age"
            value={gender_age}
            onChange={handleGender_AgeChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Select Gender/Age</option>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="child">Child</option>
          </select>
        </div>
  
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="date" className="block text-lg font-medium mb-2">Select Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full p-2 border ${dateError ? "border-red-500" : "border-gray-300"} rounded-lg`}
            min={today.toISOString().split("T")[0]}
            max={maxDate.toISOString().split("T")[0]}
            required
          />
          {dateError && <p className="text-red-500 mt-2">{dateError}</p>}
        </div>
  
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Services</label>
          {filteredServices.map((service) => (
            <div key={service} className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedServices.includes(service)}
                  onChange={handleServiceChange}
                  className="hidden peer" 
                />
                <span className="w-5 h-5 border-2 border-gray-300 rounded-md mr-2 flex items-center justify-center peer-checked:bg-yellow-500 peer-checked:border-yellow-500">
                  <svg
                    className="w-4 h-4 text-white hidden peer-checked:block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {service}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
  <label htmlFor="time" className="block text-lg font-medium mb-2">Select Time</label>
  <select
    id="time"
    value={selectedTime}
    onChange={handleTimeChange}
    className="w-full p-2 border border-gray-300 rounded-lg"
    required
    disabled={selectedServices.length === 0} 
  >
    <option value="" disabled>
      {selectedServices.length === 0 ? "No available times" : "Select a time"}
    </option>
    {availableTimes.length > 0 && selectedServices.length > 0 ? (
      availableTimes.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))
    ) : (
      <option value="" disabled>No available times</option>
    )}
  </select>
</div>
  
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Booking..." : "Book Appointment"}
        </button>
  
        {status === "error" && (
          <p className="mt-4 text-red-500">{errorMessage}</p>
        )}
        {status === "success" && (
          <p className="mt-4 text-green-500">Appointment booked successfully! An email willl be sent to you shortly, please confirm your appointment within 10 minutes </p>
        )}
      </form>
    </div>
  );
}  

export default BookAppointment;
