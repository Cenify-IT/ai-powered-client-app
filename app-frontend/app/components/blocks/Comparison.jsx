import DynamicIcon from "../utils/DynamicIcon";
import RichText from "../utils/RichText";
import { twMerge } from "tailwind-merge";

export default function Comparison(props) {
  const block = props;
  const heading = block.heading;
  const subheading = block.subheading;

  console.log("Heading:", heading);
  console.log("Subheading:", subheading);
  const comparisonCards = block.comparisonCards || [];

  const classes = block.classNames || {
    paddingY: "py-24",
    paddingX: "px-6",
    bgColor: "bg-slate-900",
    textColor: "text-white",
  };

  return (
    <section
      className={`${classes.paddingY} ${classes.bgColor} ${classes.textColor} overflow-hidden h-[100%]`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {subheading && (
            <div>
              <RichText content={subheading} />
            </div>
          )}
          {heading && (
            <div>
              <RichText content={heading} />
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisonCards.map((card, index) => (
            <div
              className={twMerge(
                card.classNames?.custom?.trim()
                  ? card.classNames.custom
                  : "relative bg-blue-600 p-8 rounded-3xl shadow-2xl transform md:scale-105 border-2 border-blue-400",
              )}
            >
              {card.cardAccent && <RichText content={card.cardAccent} />}
              {/* <div className="absolute -top-4 right-8 bg-white text-blue-600 text-xs font-black px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                Most Profitable
              </div> */}

              <div className="flex items-center gap-4 mb-8">
                <DynamicIcon
                  iconName={card.icon.name}
                  classNames={card.icon.classNames}
                  size={card.icon.size || 40}
                />
                <RichText content={card.title} />
              </div>
              {/* <ul className="space-y-6">
                {card.features.items.map((f, i) => (
                  <div
                    key={i}
                    className={twMerge(
                      card.features.classNames + " flex flex-col gap-2",
                    )}
                  >
                    <RichText content={f.label ? f.label : ""} />
                    <li className="flex items-center gap-3 text-white font-bold">
                      <DynamicIcon
                        iconName={f.icon.name}
                        classNames={f.icon.classNames}
                        size={f.icon.size || 20}
                      />
                      <RichText content={f.text} />
                    </li>
                  </div>
                ))}
              </ul> */}

              <ul className="space-y-6">
                {card.features.items.map((f, i) => (
                  <li
                    key={i}
                    className={twMerge(
                      "border-b border-blue-500/30 pb-4 last:border-0 flex flex-col gap-2",
                    )}
                  >
                    <RichText content={f.label ? f.label : ""} />

                    <div className="flex items-center gap-3 text-white font-bold">
                      <DynamicIcon
                        iconName={f.icon.name}
                        classNames={f.icon.classNames}
                        size={f.icon.size || 20}
                      />
                      <RichText content={f.text} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
