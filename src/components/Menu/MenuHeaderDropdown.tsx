"use client";

import { supabaseCLIENT } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";
import { ComponentProtected } from "../UI/Auth/PageProtected";
import { GhostButtonLink } from "../UI/ButtonLinks/GhostButtonLink";
import { GleamButton } from "../UI/Buttons/GleamButton";

const MenuHeaderDropdown = () => {
	const { authState } = useAuthModal();

	const { adminData } = authState;
	const { profile_image_thumbnail_url } = adminData || {};

	const LoggedInProfileImage = () => {
		return (
			<>
				{profile_image_thumbnail_url ? (
					<img
						src={profile_image_thumbnail_url}
						alt="Profile"
						className="w-8 h-8 rounded-full object-cover"
					/>
				) : (
					<FaUserCircle className="w-8 h-8 text-pink-500" />
				)}
			</>
		);
	};

	return (
		<div className="flex justify-center px-3">
			<FlyoutLink href="#" FlyoutContent={DropDownContent}>
				<ComponentProtected
					signedInChildren={<LoggedInProfileImage />}
					loggedOutChildren={<FiLogIn className="w-8 h-8 text-gray-300" />}
				/>
			</FlyoutLink>
		</div>
	);
};

const FlyoutLink = ({
	children,
	href,
	FlyoutContent,
}: {
	children: React.ReactNode;
	href: string;
	FlyoutContent: React.ComponentType;
}) => {
	const [open, setOpen] = useState(false);

	const showFlyout = FlyoutContent && open;

	return (
		<div
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			className="relative w-fit h-fit z-30">
			{/* The bar under the icon */}
			<a href={href} className="relative text-white">
				{children}
				<span
					style={{
						transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
					}}
					className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-sky-300 transition-transform duration-300 ease-out"
				/>
			</a>
			<AnimatePresence>
				{/* The top arrow up triangle */}
				{showFlyout && (
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 15 }}
						style={{ translateX: "-50%" }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="absolute -left-[90px] top-12 bg-white text-black">
						<div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
						<div className="absolute right-[15px] top-0 h-4 w-4  -translate-y-1/2 rotate-45 bg-white dark:bg-zinc-900" />
						<FlyoutContent />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const DropDownContent = () => {
	const { openAuthModal, authState, refreshAuthState } = useAuthModal();

	const { user } = authState;
	const { email, user_metadata } = user || {};
	const { displayName } = user_metadata || {};

	return (
		<div className="w-64 bg-white dark:bg-zinc-900 text-black dark:text-white p-6 shadow-xl">
			<div className="mb-3 space-y-3">
				<h3 className="font-semibold flex items-center gap-1">
					<BiUser className="w-4 h-4" />

					<span>Account</span>
				</h3>
				<div className="flex flex-col w-48 overflow-hidden">
					<span className="text-xs text-gray-200">{displayName}</span>
					<span className="text-xs text-gray-400">{email}</span>
				</div>

				<div className="pl-4 space-y-3">
					<div className="flex flex-col justify-start gap-2">
						{authState.loggedOut && (
							<>
								<GleamButton
									onClick={() => openAuthModal("signin")}
									icon={<FiLogIn />}>
									Sign In
								</GleamButton>
								<GleamButton
									colorStyle="emerald"
									onClick={() => openAuthModal("register")}
									icon={<FiUserPlus />}>
									Register
								</GleamButton>
							</>
						)}
						{authState.loggedIn && (
							<>
								<GhostButtonLink href="/profile">Profile</GhostButtonLink>
								<GleamButton
									onClick={async () => {
										await supabaseCLIENT.auth.signOut();
										refreshAuthState();
									}}
									colorStyle="red"
									icon={<FiLogIn />}>
									Sign Out
								</GleamButton>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MenuHeaderDropdown;
