"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  faFacebookSquare,
  faInstagramSquare,
  faPinterest,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Dynamically import modal

function Footer() {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between px-[7%] py-[75px] bg-white text-blue-800">
      {/* Column 1 */}
      <div className="flex flex-col py-10 text-center items-center">
        {/* Social Media Icons */}
        <div className="flex flex-row ">
          <Link
            className="text-md  p-2 hover:text-blue-gray-200 transition duration-500 rounded-md text-center"
            href="https://www.facebook.com/people/Best-Empathy/100092714716515/"
            target="_blank"
          >
            <FontAwesomeIcon className="" icon={faFacebookSquare} size="2x" />
          </Link>
          <Link
            className="text-md   p-2  hover:text-blue-gray-200  transition duration-500 rounded-md text-center"
            href="https://www.x.com/BestEmpathy"
            target="_blank"
          >
            <FontAwesomeIcon className="" icon={faTwitter} size="2x" />
          </Link>

          <Link
            className="text-md   p-2  hover:text-blue-gray-200  transition duration-500 rounded-md text-center"
            href="https://www.instagram.com/best.empathy/"
            target="_blank"
          >
            <FontAwesomeIcon className="" icon={faInstagramSquare} size="2x" />
          </Link>

          <Link
            className="text-md   p-2 hover:text-blue-gray-200   transition duration-500 rounded-md text-center"
            href="https://www.pinterest.com/bestempathy/"
            target="_blank"
          >
            <FontAwesomeIcon className="" icon={faPinterest} size="2x" />
          </Link>
          <Link
            className="text-md   p-2 hover:text-blue-gray-200   transition duration-500 rounded-md text-center"
            href="https://www.linkedin.com/company/best-empathy/"
            target="_blank"
          >
            <FontAwesomeIcon className="" icon={faLinkedin} size="2x" />
          </Link>
        </div>
        <div className="text-left mt-10 lg:mt-[25%] ml-10 lg:ml-[20%]">
          <h1 className="text-md text-blue-gray-200 capitalize  font-bold mt-3">
            Business Correspondence
          </h1>
          <p className="text-lg  font-bold  ">
            5831 Forward Ave #378, Pittsburgh, PA 15217
          </p>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col py-5">
        <h1 className="capitalize text-lg font-semibold text-center text-blue-gray-200">
          Who We Serve
        </h1>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services/small-business"
        >
          Small Businesses and Startups
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services/solopreneurs"
        >
          Solopreneurs
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services/therapists"
        >
          Therapists
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services/consultants"
        >
          Consultants
        </Link>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col py-5">
        <h1 className="capitalize text-lg font-semibold text-center text-blue-gray-200">
          Our Services
        </h1>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services"
        >
          AI Chatbot & SMS Automation
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services"
        >
          AI Assisted Lead Generation
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services"
        >
          AI Enhanced CRM Automation Systems
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200 transition duration-500 text-center font-semibold"
          href="/services"
        >
          Google Business Profile optimization
        </Link>
      </div>

      {/* Column 4 */}
      <div className="flex flex-col py-5">
        <h1 className="capitalize text-lg font-semibold text-center text-blue-gray-200">
          Information
        </h1>
        <Link
          className="text-md   py-3  hover:text-blue-gray-200  transition duration-500 text-center font-semibold"
          href="/about-us"
        >
          About Us
        </Link>
        {/* Add Scroll Functionality or Modal Open Up */}
        {/* <ScrollLink
          to="contactformLargeScreen"
          smooth
          duration={400}
          className="text-md py-3  hover:text-blue-gray-200  transition duration-500 text-center font-semibold cursor-pointer"
        >
          Contact Us
        </ScrollLink> */}
        <Link
          className="text-md py-3 hover:text-blue-gray-200  transition duration-500 text-center font-semibold"
          href="/contact-us"
        >
          Contact Us
        </Link>
        <Link
          className="text-md py-3 hover:text-blue-gray-200  transition duration-500 text-center font-semibold"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link
          className="text-md   py-3 hover:text-blue-gray-200   transition duration-500 text-center font-semibold"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

export default Footer;
