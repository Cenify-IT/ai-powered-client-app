// const percentageWidths = [
//   "w-full",
//   "w-auto",
//   "w-fit",
//   ...Array.from({ length: 100 }, (_, i) => `w-[${i + 1}%]`),
// ];

// const pixelWidths = [
//   "w-[100px]",
//   "w-[150px]",
//   "w-[200px]",
//   "w-[250px]",
//   "w-[300px]",
//   "w-[350px]",
//   "w-[400px]",
//   "w-[450px]",
//   "w-[500px]",
//   "w-[550px]",
//   "w-[600px]",
//   "w-[650px]",
//   "w-[700px]",
//   "w-[750px]",
//   "w-[800px]",
//   "w-[850px]",
//   "w-[900px]",
//   "w-[950px]",
//   "w-[1000px]",
//   "w-[1100px]",
//   "w-[1200px]",
//   "w-[1300px]",
//   "w-[1400px]",
//   "w-[1500px]",
// ];

// module.exports = {
//   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
//   //   safelist: [
//   //     "bg-white",
//   //     "text-xs",
//   //     "text-sm",
//   //     "text-md",
//   //     "text-lg",
//   //     "text-xl",
//   //     "text-2xl",
//   //     "text-3xl",
//   //     "text-4xl",
//   //     "text-5xl",
//   //     "text-6xl",
//   //     "text-slate-900",
//   //     "text-slate-600",
//   //     "text-blue-600",
//   //     "text-blue-700",
//   //     "bg-blue-600",
//   //     "bg-blue-700",
//   //     "bg-blue-200",
//   //     "text-white",
//   //     "border-slate-200",
//   //     "bg-slate-50",
//   //     "border-slate-100",
//   //     "bg-green-500",
//   //     "shadow-lg",
//   //     "hover:shadow-lg",
//   //     "hover:text-blue-600",
//   //   ],
//   // safelist: [
//   //   {
//   //     pattern:
//   //       /^(text|bg|border|hover:text|hover:bg|shadow|hover:shadow|font|tracking|mt|ml|mr|mb|leading)-/,
//   //   },
//   // ],
//   safelist: [{ pattern: /.*/ }],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      // This catches 95% of standard Tailwind classes (w-16, mt-8, text-xl, font-bold, bg-red-500, etc.)
      pattern:
        /^(m|mt|mb|ml|mr|mx|my|p|pt|pb|pl|pr|px|py|w|h|min-w|max-w|min-h|max-h|text|font|leading|tracking|bg|border|rounded|shadow|flex|grid|gap|items|justify|block|inline|hidden|absolute|relative|top|right|bottom|left|z|opacity)-/,
      variants: ["sm", "md", "lg", "xl", "2xl"], // Automatically generates md:w-96, lg:text-2xl, etc.
    },
    {
      // This catches classes without hyphens (italic, uppercase, truncate, etc.)
      pattern:
        /^(italic|not-italic|uppercase|lowercase|capitalize|normal-case|underline|line-through|no-underline|truncate|sr-only|not-sr-only|antialiased|subpixel-antialiased|w-full|w-auto|w-fit|h-full|h-auto)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
  ],
};
