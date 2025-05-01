import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

type GleamButtonProps = {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  rest?: object;
  colorStyle?:
    | "green"
    | "sky"
    | "emerald"
    | "red"
    | "yellow"
    | "blue"
    | "orange";
  onClick?: () => void;
  isLoadingState?: boolean;
};

export const GleamButton = ({
  children,
  className,
  icon,
  rest,
  colorStyle,
  onClick,
  isLoadingState,
}: GleamButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
				px-4 py-2 font-semibold
				transition-all duration-500
				before:absolute before:inset-0
				before:-z-10 before:translate-x-[150%]
				before:translate-y-[150%] before:scale-[2.5]
				before:rounded-[100%] 
				before:transition-transform before:duration-1000
				before:content-[""]
				hover:scale-105 hover:text-neutral-900
				hover:before:translate-x-[0%]
				hover:before:translate-y-[0%]
				active:scale-95`,

        colorStyle === "green" &&
          "border-green-400 text-green-400 before:bg-green-400",
        colorStyle === "emerald" &&
          "border-emerald-400 text-emerald-400 before:bg-emerald-400",
        colorStyle === "red" && "border-red-400 text-red-400 before:bg-red-400",
        colorStyle === "yellow" &&
          "border-yellow-400 text-yellow-400 before:bg-yellow-400",
        colorStyle === "blue" &&
          "border-blue-400 text-blue-400 before:bg-blue-400",
        colorStyle === "orange" &&
          "border-orange-400 text-orange-400 before:bg-orange-400",
        // Default color if none passed
        (colorStyle === "sky" || !colorStyle) &&
          "border-sky-400 text-sky-400 before:bg-sky-400",
        className,
      )}
      {...rest}
    >
      {isLoadingState ? <FiLoader className="animate-spin" /> : icon}
      {children}
    </button>
  );
};
