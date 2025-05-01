import clsx from "clsx";

type BubbleButtonProps = {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  rest?: object;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export const BubbleButton = ({
  children,
  className,
  active,
  rest,
  onClick,
  icon,
}: BubbleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `
        relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md 
        border border-sky-700 dark:border-zinc-700 
        bg-gradient-to-br from-sky-500 to-sky-700 dark:from-zinc-800 dark:to-zinc-950
        px-3 py-1.5
        text-zinc-50 transition-all duration-300
        
        before:absolute before:inset-0
        before:-z-10 before:translate-y-[200%]
        before:scale-[2.5]
        before:rounded-[100%] before:bg-zinc-100
        before:transition-transform before:duration-500
        before:content-[""]

        hover:scale-105 hover:text-sky-700 dark:hover:text-zinc-900
        hover:before:translate-y-[0%]
        active:scale-100`,
        active ? " outline-dashed outline-sky-600" : "",
        className,
      )}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
