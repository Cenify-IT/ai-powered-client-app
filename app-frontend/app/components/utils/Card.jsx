import DynamicIcon from "./DynamicIcon";
import RichText from "./RichText";

export default function Card({
  icon,
  title,
  description,
  number,
  displayNumber = false,
  classNames = {},
}) {
  return (
    <div
      className={`
        p-8 rounded-3xl border 
        ${classNames.border || "border-slate-100"} 
        ${classNames.bg || "bg-white"} 
        ${classNames.hoverBorder || "hover:border-blue-100"} 
        ${classNames.hoverShadow || "hover:shadow-2xl hover:shadow-blue-50"} 
        transition-all duration-300 group flex flex-col items-center lg:items-start
        ${classNames.custom || ""}
      `}
    >
      <div className="flex justify-between items-center w-[100%]">
        {icon && (
          <div
            className={`
          ${icon.classNames || "text-2xl p-5 rounded-2xl transition-all duration-500 bg-blue-50"}
          `}
          >
            <DynamicIcon iconName={icon.name} />
          </div>
        )}

        {number && displayNumber && (
          <span
            className={`
            text-5xl font-black 
            ${classNames.numberTextColor || "text-slate-100"} 
            group-hover:text-blue-50 
            transition-colors
            `}
          >
            {number}
          </span>
        )}
      </div>
      <div className="my-2" />

      {title && <RichText content={title} />}

      {description && <RichText content={description} />}
    </div>
  );
}
