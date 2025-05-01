export const Divider = ({ text }: { text?: string }) => {
  return (
    <div className="my-3 md:my-6 flex items-center gap-3">
      <div className="h-[1px] w-full bg-zinc-700" />
      <span className="text-zinc-600 dark:text-zinc-400 text-nowrap">
        {text || "OR"}
      </span>
      <div className="h-[1px] w-full bg-zinc-700" />
    </div>
  );
};
