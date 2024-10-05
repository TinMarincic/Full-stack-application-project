"use client"; 

import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faClock, faXmark, faLocationPin, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "700" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <header className="bg-yellow-400 text-white p-4">
          <nav className="container mx-auto flex items-center justify-between">
            <div className={`${playfair.className} text-3xl font-bold text-gray-800`}>Bella</div>
            <button className="lg:hidden focus:outline-none" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
            <ul className="hidden lg:flex space-x-4">
              <li>
                <Link href="/" className="relative group">
                  Home
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/about_us" className="relative group">
                  About us
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="relative group">
                  Contact
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="relative group">
                  Services
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/booking" className="relative group">
                  Book appointment
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar for mobile */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 lg:hidden`}
          >
            <div className="absolute left-0 top-0 w-64 h-full bg-yellow-400 p-8 flex flex-col space-y-4">
              {/* Sidebar Logo */}
              <div className={`${playfair.className} text-2xl font-bold text-white mb-6`}>Bella</div>

              <button className="self-end mb-4 focus:outline-none" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <Link href="/" className="relative group text-white text-lg" onClick={toggleMenu}>
                Home
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              {/*<Link href="/about_us" className="relative group text-white text-lg" onClick={toggleMenu}>
                About us
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link href="/contact" className="relative group text-white text-lg" onClick={toggleMenu}>
                Contact
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link href="/services" className="relative group text-white text-lg" onClick={toggleMenu}>
                Services
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>*/}
              <Link href="/booking" className="relative group text-white text-lg" onClick={toggleMenu}>
                Book appointment
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto flex-grow">{children}</main>
        
        <footer className="bg-gray-700 text-[rgb(255,248,248)] w-full p-4">
          <div className="container mx-auto px-8 md:px-20">
            <div className="footer-row flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-4 space-y-4 md:space-y-0">
              <div className="footer-left text-sm text-center md:text-left max-w-md">
                <h1 className="text-base font-bold mb-2">Working hours</h1>
                <p className="mb-2 flex items-center justify-center md:justify-start">
                  Monday to Friday - 10am to 6pm
                  <FontAwesomeIcon icon={faClock} className="ml-2 text-xs w-4 h-4" />
                </p>
                <p className="mb-2 flex items-center justify-center md:justify-start">
                  Saturday - 10am to 4pm
                  <FontAwesomeIcon icon={faClock} className="ml-2 text-xs w-4 h-4" />
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  Sunday - not working
                  <FontAwesomeIcon icon={faXmark} className="ml-2 text-xs w-4 h-4" />
                </p>
              </div>
              <div className="footer-right text-sm text-center md:text-left max-w-md">
                <h1 className="text-base font-bold mb-2">Get in touch</h1>
                <p className="mb-2 flex items-center justify-center md:justify-start">
                  Address: Malta 1, Sarajevo
                  <FontAwesomeIcon icon={faLocationPin} className="ml-2 text-xs w-4 h-4" />
                </p>
                <p className="mb-2 flex items-center justify-center md:justify-start">
                  E-mail: bella@gmail.com
                  <FontAwesomeIcon icon={faEnvelope} className="ml-2 text-xs w-4 h-4" />
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  Phone: +387-60-684-547
                  <FontAwesomeIcon icon={faPhone} className="ml-2 text-xs w-4 h-4" />
                </p>
              </div>
            </div>
            <div className="social-media-links flex justify-center space-x-4">
              <a href="https://www.instagram.com/bella.f.s._?igsh=MTN0MGlyc2cxNGg5bg==" className="text-white text-xs">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
              <a href="https://m.facebook.com/people/frizerski-salon-Bella/100063623705613/" className="text-white text-xs">
                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
