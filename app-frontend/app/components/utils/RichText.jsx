// // export default function RichText({ content, themeColors }) {
// //   console.log("Content");
// //   console.log(content);
// //   const items = Array.isArray(content) ? content : [content];

// //   return (
// //     <div className="w-full">
// //       {items.map((item, index) => {
// //         // If the item itself is an array, render as inline <span>s inside a <div>
// //         if (Array.isArray(item)) {
// //           return (
// //             <div key={index}>
// //               {item.map((subItem, subIndex) => {
// //                 let classes = [];

// //                 if (subItem.classNames) classes.push(subItem.classNames);
// //                 if (subItem.size) classes.push(subItem.size);
// //                 if (subItem.bold) classes.push("font-bold");
// //                 if (subItem.italic) classes.push("italic");
// //                 if (subItem.color && themeColors?.[subItem.color]) {
// //                   classes.push(themeColors[subItem.color]);
// //                 }

// //                 return (
// //                   <span key={subIndex} className={classes.join(" ")}>
// //                     {subItem.text}
// //                   </span>
// //                 );
// //               })}
// //             </div>
// //           );
// //         }

// //         // Otherwise it's a single object
// //         let classes = [];
// //         if (item.classNames) classes.push(item.classNames);
// //         if (item.size) classes.push(item.size);
// //         if (item.bold) classes.push("font-bold");
// //         if (item.italic) classes.push("italic");
// //         if (item.color && themeColors?.[item.color]) {
// //           classes.push(themeColors[item.color]);
// //         }

// //         return (
// //           <div key={index}>
// //             <span className={classes.join(" ")}>{item.text}</span>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // export default function RichText({ content, themeColors }) {
// //   const items = Array.isArray(content) ? content : [content];

// //   return (
// //     <div className="w-full">
// //       {items.map((item, index) => {
// //         if (Array.isArray(item)) {
// //           return (
// //             <div key={index}>
// //               {item.map((subItem, subIndex) => {
// //                 let classes = [];

// //                 if (subItem.classNames) classes.push(subItem.classNames);
// //                 if (subItem.size) classes.push(subItem.size);
// //                 if (subItem.bold) classes.push("font-bold");
// //                 if (subItem.italic) classes.push("italic");
// //                 if (subItem.color && themeColors?.[subItem.color]) {
// //                   classes.push(themeColors[subItem.color]);
// //                 }

// //                 return (
// //                   <span key={subIndex} className={classes.join(" ")}>
// //                     {subItem.text}
// //                   </span>
// //                 );
// //               })}
// //             </div>
// //           );
// //         }

// //         let classes = [];
// //         if (item.classNames) classes.push(item.classNames);
// //         if (item.size) classes.push(item.size);
// //         if (item.bold) classes.push("font-bold");
// //         if (item.italic) classes.push("italic");
// //         if (item.color && themeColors?.[item.color]) {
// //           classes.push(themeColors[item.color]);
// //         }

// //         return (
// //           <div key={index} className={classes.join(" ")}>
// //             {item.text}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // "use client";

// // import React from "react";
// // import { useTheme } from "../../context/theme/context";
// // export default function RichText({ content }) {
// //   const { themeColors } = useTheme();
// //   const blocks = Array.isArray(content) ? content : [content];

// //   return (
// //     <>
// //       {blocks.map((block, i) => {
// //         const Tag = block.tag || "div";

// //         return (
// //           <Tag key={i} className={block.classNames}>
// //             {block.segments?.map((seg, j) => {
// //               const classes = [
// //                 seg.classNames,
// //                 seg.bold && "font-bold",
// //                 seg.italic && "italic",
// //                 seg.color && themeColors?.[seg.color],
// //               ]
// //                 .filter(Boolean)
// //                 .join(" ");

// //               return (
// //                 <span key={j} className={classes}>
// //                   {seg.text}
// //                 </span>
// //               );
// //             })}
// //           </Tag>
// //         );
// //       })}
// //     </>
// //   );
// // }

// "use client";

// import React from "react";
// import { useTheme } from "../../context/theme/context";

// export default function RichText({ content }) {
//   const { themeColors } = useTheme();
//   const blocks = Array.isArray(content) ? content : [content];

//   return (
//     <>
//       {blocks.map((block, i) => {
//         const Tag = block.tag || "div";

//         return (
//           <Tag key={i} className={block.classNames}>
//             {/* {block.segments?.map((seg, j) => {
//               const classes = [
//                 seg.classNames,
//                 seg.bold && "font-bold",
//                 seg.italic && "italic",
//                 seg.color && themeColors?.[seg.color],
//               ]
//                 .filter(Boolean)
//                 .join(" ");

//               const SegTag = seg.tag || "span";

//               return (
//                 <SegTag key={j} className={classes}>
//                   {seg.text}
//                 </SegTag>
//               );
//             })} */}
//             {block.segments?.map((seg, j) => {
//               const classes = [
//                 seg.classNames,
//                 seg.bold && "font-bold",
//                 seg.italic && "italic",
//                 seg.color && themeColors?.[seg.color],
//               ]
//                 .filter(Boolean)
//                 .join(" ");

//               if (!classes) {
//                 return <React.Fragment key={j}>{seg.text}</React.Fragment>;
//               }

//               return (
//                 <span key={j} className={classes}>
//                   {seg.text}
//                 </span>
//               );
//             })}
//           </Tag>
//         );
//       })}
//     </>
//   );
// }

"use client";

import React from "react";
import { useTheme } from "../../context/theme/context";

export default function RichText({ content }) {
  const { themeColors } = useTheme();
  const blocks = Array.isArray(content) ? content : [content];

  return (
    <>
      {blocks.map((block, i) => {
        const Tag = block.tag || "div";

        return (
          <Tag key={i} className={block.classNames}>
            {block.segments?.map((seg, j) => {
              const classes = [
                seg.classNames,
                seg.bold && "font-bold",
                seg.italic && "italic",
                seg.color && themeColors?.[seg.color],
              ]
                .filter(Boolean)
                .join(" ");

              const SegTag = seg.tag || "span";

              // Handle <br>
              if (seg.tag === "br") {
                return <br key={j} className={classes} />;
              }

              // No styling → plain text
              if (!classes && !seg.tag) {
                return <React.Fragment key={j}>{seg.text}</React.Fragment>;
              }

              return (
                <SegTag key={j} className={classes}>
                  {seg.text}
                </SegTag>
              );
            })}
          </Tag>
        );
      })}
    </>
  );
}
