import React from "react";

interface Props {
  color: "red" | "yellow" | "green";
  label: string;
  onClick?: () => void;
}

const OrderStates: React.FC<Props> = ({ color, label, onClick }) => {
  const colorClasses = {
    red: {
      background: "bg-red-100",
      text: "text-red-500",
      hoverBackground: "hover:bg-red-600",
      hoverText: "hover:text-white",
      focusRing: "focus:ring-red-500",
    },
    yellow: {
      background: "bg-yellow-100",
      text: "text-yellow-500",
      hoverBackground: "hover:bg-yellow-600",
      hoverText: "hover:text-white",
      focusRing: "focus:ring-yellow-500",
    },
    green: {
      background: "bg-green-100",
      text: "text-green-500",
      hoverBackground: "hover:bg-green-600",
      hoverText: "hover:text-white",
      focusRing: "focus:ring-green-500",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 px-4 inline-flex justify-center items-center rounded-md border border-transparent font-semibold ${colorClasses[color].background} ${colorClasses[color].text} ${colorClasses[color].hoverBackground} ${colorClasses[color].hoverText} ${colorClasses[color].focusRing} focus:outline-none focus:ring-2 ring-offset-white focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800`}
    >
      {label}
    </button>
  );
};

export default OrderStates;
