"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Accordion({ items = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  const handleToggle = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={index}
            className={`
              mb-4
              ${block.desktopOnly ? "hidden lg:block" : ""}
            `}
          >
            {block.text}
          </p>
        );

      case "list":
        return (
          <ul key={index} className="list-disc pl-5 my-4 space-y-2">
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );

      case "link":
        return (
          <a key={index} href={block.url} className="text-blue-600 underline">
            {block.label}
          </a>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      {items.map(({ id, question, content }) => {
        const isOpen = openFaq === id;

        return (
          <div
            key={id}
            className="
              bg-white 
              dark:bg-gray-800 
              rounded-2xl 
              shadow-md 
              overflow-hidden 
              border 
              border-gray-200 
              dark:border-gray-700
            "
          >
            {/* Accordion Header */}
            <button
              onClick={() => handleToggle(id)}
              className="
                flex 
                justify-between 
                items-center 
                w-full 
                px-6 
                py-5 
                focus:outline-none 
                hover:bg-gray-50 
                dark:hover:bg-gray-700 
                transition-colors 
                duration-300
              "
            >
              <p
                className="
                  text-left 
                  text-lg 
                  lg:text-xl 
                  font-medium 
                  text-gray-900 
                  dark:text-gray-100
                "
              >
                {question}
              </p>

              <FontAwesomeIcon
                icon={faChevronDown}
                className={`
                  w-5 
                  h-5 
                  text-blue-600 
                  transition-transform 
                  duration-300
                  ${isOpen ? "rotate-180" : "rotate-0"}
                `}
              />
            </button>

            {/* Accordion Content */}
            <div
              className={`
                overflow-hidden
                transition-[max-height]
                duration-500
                ease-in-out
                ${isOpen ? "max-h-[1000px]" : "max-h-0"}
              `}
            >
              <div
                className="
                  px-6 
                  pb-6 
                  pt-0 
                  text-gray-700 
                  dark:text-gray-300 
                  text-base 
                  lg:text-lg
                "
              >
                {content?.map(renderContentBlock)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
