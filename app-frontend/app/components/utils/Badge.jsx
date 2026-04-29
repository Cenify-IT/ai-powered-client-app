import DynamicIcon from "./DynamicIcon";
import RichText from "../utils/RichText";

export default function Badge({ data }) {
  return (
    <div className={`inline-flex items-center gap-2 ${data.classNames || ""}`}>
      {data.icon && (
        <div
          className={`flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 ${data.icon.classNames}`}
        >
          <DynamicIcon iconName={data.icon.name} />
        </div>
      )}
      <div className="flex flex-col leading-tight w-[200px]">
        {data.label && <RichText content={data.label} />}
        {data.sublabel && <RichText content={data.sublabel} />}
      </div>
    </div>
  );
}
