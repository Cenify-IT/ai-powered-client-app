"use client";
import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

import DynamicIcon from "./DynamicIcon";
import RichText from "./RichText";

export default function Accordion({ items }) {
  const [openFaq, setOpenFaq] = useState(null);

  const handleToggle = (id) => setOpenFaq(openFaq === id ? null : id);

  return (
    <div className="w-full space-y-4">
      {items.map(({ id, question, answer, icon }) => {
        const isOpen = openFaq === id;
        return (
          <div
            key={id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Accordion Header */}
            <button
              onClick={() => handleToggle(id)}
              className="flex justify-between items-center w-full px-6 py-5 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {/* <p className="text-left text-lg lg:text-xl font-medium text-gray-900 dark:text-gray-100"> */}
              <RichText content={question} />
              {/* </p> */}
              {icon ? (
                <DynamicIcon
                  iconName={icon.name}
                  classNames={`${icon.classNames} ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              ) : (
                <DynamicIcon
                  iconName="FaChevronDown"
                  classNames={`w-5 h-5 text-black transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
              {/* <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`} */}

              {/* /> */}
            </button>

            {/* Accordion Panel */}
            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                isOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              {/* <div className="px-6 pb-6 pt-0 text-gray-700 dark:text-gray-300 text-base lg:text-lg"> */}
              <RichText content={answer} />
              {/* </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
