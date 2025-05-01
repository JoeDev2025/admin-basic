import { Unbounded } from "next/font/google";

const unbounded = Unbounded({
	variable: "--font-syne",
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin", "cyrillic"],
});

type FontProps = {
	children: React.ReactNode | string;
};

// Do not export this component as NextJS will throw an error when building
export const FontUnbounded = ({ children }: FontProps) => (
	<span className={` ${unbounded.className} `}>{children}</span>
);