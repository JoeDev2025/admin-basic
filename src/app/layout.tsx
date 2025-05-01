import { FontUnbounded } from "@/components/UI/Fonts";
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Admin Site",
  description: "Joes new Admin Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isDev = process.env.NODE_ENV === "development";

	return (
		<html lang="en">
			<body className={`antialiased`} suppressHydrationWarning={isDev}>
				<FontUnbounded>{children}</FontUnbounded>
			</body>
		</html>
	);
}
