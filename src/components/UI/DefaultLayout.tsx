"use client";

import Sidebar from "@/components/Menu/Sidebar";
import { useState } from "react";
import { HiBars3 } from "react-icons/hi2";
import MenuHeaderDropdown from "../Menu/MenuHeaderDropdown";

export default function DefaultLayout(props: { children?: React.ReactNode }) {
	const { children } = props;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return (
		<div className="flex">
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
			<BodyContentAndHeader
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}>
				{children}
			</BodyContentAndHeader>
		</div>
	);
}

type SidebarOpeningProps = {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
};

type BodyContentAndHeaderProps = {
	children?: React.ReactNode;
} & SidebarOpeningProps;

const BodyContentAndHeader = (props: BodyContentAndHeaderProps) => {
	const { children, sidebarOpen, setSidebarOpen } = props;
	return (
		<div className="relative flex flex-1 flex-col lg:ml-72">
			<HeaderOnly sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
			<BodyOnly>{children}</BodyOnly>
		</div>
	);
};

const HeaderOnly = ({ sidebarOpen, setSidebarOpen }: SidebarOpeningProps) => {
	return (
		<div className="flex justify-between px-6 h-16 items-center  bg-zinc-900">
			{/* 3 Bars menu button is only shown when Menu is collapsed */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				aria-controls="sidebar"
				className="block lg:hidden" // Only shows when the screen is small
			>
				<span className="border border-px border-white/10 w-10 h-10 flex items-center justify-center text-3xl">
					<HiBars3 />
				</span>
			</button>
			{/* Menu open - use an empty div for now */}
			<div className="hidden lg:flex" />

			{/* 3 Bars are only shown when Menu is collapsed */}
			<MenuHeaderDropdown />
		</div>
	);
};

const BodyOnly = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
				{children}
			</div>
		</main>
	);
};
