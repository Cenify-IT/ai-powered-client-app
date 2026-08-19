import { componentsMap } from "./componentMap";
export default function RenderSections({ sections, client }) {
  return (
    <>
      {sections.map((section, idx) => {
        // console.log("Section is ", section);
        const Component = componentsMap[section.__component];

        // console.log(
        //   "Rendering section:",
        //   section.__component,
        //   "with data:",
        //   section,
        // );

        if (!Component) {
          console.warn(`Component for "${section.__component}" not found!`);
          return null;
        }

        return (
          <div key={idx}>
            <Component key={idx} {...section} client={client} />
          </div>
        );
      })}
    </>
  );
}
