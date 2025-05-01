import clsx from "clsx";
import Link from "next/link";

type GhostButtonLinkProps = {
	href: string;
	children: React.ReactNode;
	className?: string;
};

export const GhostButtonLink = ({
	href,
	children,
	className,
}: GhostButtonLinkProps) => {
	return (
		<Link
			href={href}
			className={clsx(
				"rounded-md px-4 py-2  transition-all hover:scale-[1.02] hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98] text-center border border-zinc-700",
				"text-zinc-800 dark:text-zinc-100",
				className
			)}>
			{children}
		</Link>
	);
};
