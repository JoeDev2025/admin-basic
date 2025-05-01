"use client";

import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { BrandingHeader } from "../Branding/BrandingItems";
import Menu from "./Menu";

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
	// Need to add a method that closes it when window resizes and works 100%

	return (
		<ClickOutside onClick={() => setSidebarOpen(false)}>
			<aside
				className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-zinc-900 duration-300 ease-linear  lg:translate-x-0  ${
					sidebarOpen
						? "translate-x-0 shadow-lg shadow-black lg:shadow-none"
						: "-translate-x-full"
				}`}>
				<div className="flex items-center justify-between px-6 py-6 gap-3">
					<BrandingHeader />
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						aria-controls="sidebar"
						className="block lg:hidden" // Only shows when the screen is small
					>
						<FaTimes />
					</button>
				</div>
				<Menu />
			</aside>
		</ClickOutside>
	);
};
export default Sidebar;

// Determine if the user has clicked outside the sidebar
const ClickOutside = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClick();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);

	return <div ref={ref}>{children}</div>;
};
