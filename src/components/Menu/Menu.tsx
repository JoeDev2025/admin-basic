"use client";
import { VERSION } from "@/VERSION";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { menuItems } from "../../configs/menuItems";
import { ComponentProtected } from "../UI/Auth/PageProtected";

export default function Menu() {
	const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const pathname = usePathname();

	// Automatically expand the parent menu if a child route matches the current path
	useEffect(() => {
		const initialExpanded: { [key: number]: boolean } = {};
		menuItems.forEach((item, index) => {
			if (item.children) {
				const isChildActive = item.children.some(
					(child) => child.route === pathname
				);
				if (isChildActive) {
					initialExpanded[index] = true;
				}
			}
		});
		setExpanded(initialExpanded);
	}, [pathname]);

	useEffect(() => {
		// Disable initial animation after the first render
		const timeout = setTimeout(() => setIsInitialLoad(false), 500); // Adjust timing to match initial animation duration
		return () => clearTimeout(timeout);
	}, []);

	const toggleExpand = (index: number) => {
		setExpanded((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const IconDisplay = ({
		icon,
		isActive,
	}: {
		icon?: React.ElementType;
		isActive: boolean;
	}) => {
		const Icon = icon || GoDotFill;

		return (
			<Icon
				className={clsx(
					isActive ? "text-sky-500" : "text-pink-500",
					"w-4 h-4 "
				)}
			/>
		);
	};

	const isActive = (route?: string): boolean => {
		return pathname === route;
	};

	const LoggedInMenu = () => {
		return (
			<div className="flex flex-col justify-between h-screen">
				<div>
					{/* Main Menu Wrapper */}
					<motion.div
						className="flex flex-col px-3 gap-3"
						initial={isInitialLoad ? "hidden" : false}
						animate={isInitialLoad ? "visible" : false}
						variants={{
							visible: {
								transition: {
									staggerChildren: 0.2,
								},
							},
						}}>
						{menuItems.map((item, index) => (
							<div key={index}>
								{/* Parent Menu Item */}
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
									transition={{ duration: 0.5 }}>
									{item.children && item.children.length > 0 ? (
										// Parent with children to expand
										<div
											className="flex items-center gap-3 transition-colors duration-200 ease-in-out hover:bg-white/10 py-2 px-2 cursor-pointer"
											onClick={() => toggleExpand(index)}>
											{expanded[index] && item.iconExpanded ? (
												<IconDisplay
													icon={item.iconExpanded}
													isActive={isActive(item.route)}
												/>
											) : (
												<IconDisplay
													icon={item.icon}
													isActive={isActive(item.route)}
												/>
											)}

											<span
												className={clsx(
													isActive(item.route) ? "font-bold" : "font-light"
												)}>
												{item.label}
											</span>
										</div>
									) : (
										// Parent without children
										<Link
											href={item.route || "#"}
											className="flex items-center gap-3 transition-colors duration-200 ease-in-out hover:bg-white/10 py-2 px-2">
											<IconDisplay
												icon={item.icon}
												isActive={isActive(item.route)}
											/>
											<span
												className={clsx(
													isActive(item.route) ? "font-bold" : "font-light"
												)}>
												{item.label}
											</span>
										</Link>
									)}
								</motion.div>

								{/* Sub-menu Items */}
								{expanded[index] &&
									item.children &&
									item.children.map((child, childIndex) => (
										<motion.div
											key={childIndex}
											className="ml-3"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}>
											<Link
												href={child.route || "#"}
												className="flex items-center gap-3 transition-colors duration-200 ease-in-out hover:bg-white/10 py-1 px-2">
												<IconDisplay
													icon={child.icon}
													isActive={isActive(child.route)}
												/>
												<span
													className={clsx(
														isActive(child.route) ? "font-bold" : "font-light"
													)}>
													{child.label}
												</span>
											</Link>
										</motion.div>
									))}
							</div>
						))}
					</motion.div>
				</div>
				{/* Footer */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="text-center mb-6 font-extralight">
					Version: <span className="font-bold">{VERSION}</span>
				</motion.div>
			</div>
		);
	};

	const LoggedOutMenu = () => (
		<div className="flex flex-col gap-3 justify-center items-center border border-sky-200 bg-sky-800/10 text-sky-200 p-4 rounded-lg mt-12 w-48 mx-auto">
			<FiLogIn className="w-8 h-8" />
			<p className="text-center">Please login to use this dashboard!</p>
		</div>
	);

	return (
		<ComponentProtected
			signedInChildren={<LoggedInMenu />}
			loggedOutChildren={<LoggedOutMenu />}
		/>
	);
}
