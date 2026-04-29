"use client";
import RichText from "../utils/RichText";
import DynamicIcon from "../utils/DynamicIcon";
import { useTheme } from "../../context/theme/context";
import { twMerge } from "tailwind-merge";

export default function FinalCTA(props) {
  const { themeColors } = useTheme();
  const block = props || {};

  const heading = block.heading;
  const subheading = block.subheading;
  const additionalInfo = block.additional || "";

  const classes = block.classNames || {
    sectionBgColor: "bg-white",
    sectionPaddingY: "py-20",
    sectionPaddingX: "px-6",
    containerPaddingX: "px-6",
    containerPaddingY: "py-12",
  };

  const links = block.ctaLinks || [];

  return (
    <section
      className={`relative ${classes.sectionPaddingY} ${classes.sectionPaddingX} ${classes.sectionBgColor} `}
    >
      <div
        className={`container mx-auto ${classes.containerPaddingX}  ${classes.containerPaddingY} ${classes.custom}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Heading */}
          <RichText content={heading} />

          {/* Subheading */}
          <RichText content={subheading} />

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {links.map((link) => {
              if (link.data.type === "action") {
                return (
                  <button
                    className={twMerge(
                      `${themeColors["primaryButtonText"]}
   ${themeColors["primaryButtonBg"]}
   ${themeColors["primaryButtonHoverShadow"]}
   transition-all px-5 py-2 rounded-full cursor-pointer`,
                      link.classNames?.custom,
                    )} // onClick={() => actionHandler(link.data.action)}
                  >
                    {/* Left Icon */}
                    {link.data.icon && link.data.iconPosition === "left" && (
                      <span className="mr-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                    {link.data.label}
                    {/* Right Icon */}
                    {link.data.icon && link.data.iconPosition === "right" && (
                      <span className="ml-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                  </button>
                );
              } else if (link.data.type === "link") {
                return (
                  <a
                    href={link.data.href || "#"}
                    className={twMerge(
                      `${themeColors["primaryButtonText"]}
   ${themeColors["primaryButtonBg"]}
   ${themeColors["primaryButtonHoverShadow"]}
   transition-all px-5 py-2 rounded-full cursor-pointer`,
                      link.classNames?.custom,
                    )}
                  >
                    {/* Left Icon */}
                    {link.data.icon && link.data.iconPosition === "left" && (
                      <span className="mr-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}

                    {link.data.label}

                    {/* Right Icon */}
                    {link.data.icon && link.data.iconPosition === "right" && (
                      <span className="ml-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                  </a>
                );
              }
            })}
          </div>

          {/* Additional Info */}
          <RichText content={additionalInfo} />
        </div>
      </div>
    </section>
  );
}

// import { FaPhoneAlt, FaCommentDots } from "react-icons/fa";

// export default function FinalCTA() {
//   return (
//     <section className="relative py-20 bg-white">
//       <div className="container mx-auto px-6">
//         <div className="relative bg-blue-600 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
//           {/* Abstract background decoration */}
//           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50" />
//           <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30" />

//           <div className="relative z-10 max-w-4xl mx-auto text-center">
//             <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
//               Ready to stop the leak? <br className="hidden md:block" />
//               Our AI Dispatcher is{" "}
//               <span className="text-blue-200">ready right now.</span>
//             </h2>
//             <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
//               Don't wait for a callback that might never come. Secure your spot
//               on our schedule in seconds via text or phone.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-6 justify-center">
//               {/* Primary Action */}
//               <button className="flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-black text-xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95">
//                 <FaCommentDots />
//                 Text Us Now
//               </button>

//               {/* Secondary Action */}
//               <a
//                 href="tel:+15550000000"
//                 className="flex items-center justify-center gap-3 border-2 border-blue-400 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-blue-500 transition-all"
//               >
//                 <FaPhoneAlt />
//                 (555) 000-0000
//               </a>
//             </div>

//             <p className="mt-8 text-blue-200 text-sm font-bold uppercase tracking-widest">
//               🟢 Average Dispatch Time: 2 Minutes
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
