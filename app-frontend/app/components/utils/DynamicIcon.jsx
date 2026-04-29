// components/DynamicIcon.tsx
import * as FaIcons from "react-icons/fa";

export default function DynamicIcon({ iconName, classNames, size = 30 }) {
  const IconComponent = FaIcons[iconName];

  const DefaultIcon = FaIcons["FaQuestionCircle"]; // Default icon if not found

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found!`);
    return <DefaultIcon className={classNames} size={size || 30} />;
  }

  return <IconComponent className={classNames} size={size || 30} />;
}
