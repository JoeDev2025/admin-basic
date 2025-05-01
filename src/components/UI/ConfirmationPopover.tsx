import { LoaderTiny } from "@/components/UI/Loaders";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";

/**
 * A delete button and confirmation dialog that requires the user to confirm their action.
 * The user can confirm by clicking "Yes" or cancel by clicking "No".
 * Has option children to use as a message or additional content.
 * Removes automatically after no interaction for 3 seconds.
 */

type ConfirmationPopoverProps = {
	onConfirm: () => void;
	onCancel: () => void;
	isProcessing?: boolean;
	children?: React.ReactNode;
	type?: "delete" | "custom";
	customText?: string;
	iconOutLine?: boolean;
};

const ConfirmationPopover: React.FC<ConfirmationPopoverProps> = ({
	onConfirm,
	onCancel,
	isProcessing,
	children,
	type = "delete",
	customText = "Press Me",
	iconOutLine = false,
}) => {
	const [confirmDelete, setConfirmDelete] = useState(false);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseLeave = () => {
		// Start the 1-second hover-based close timer
		hoverTimeoutRef.current = setTimeout(() => {
			setConfirmDelete(false);
			onCancel(); // Notify parent that the confirmation was canceled
		}, 1000);
	};

	const handleMouseEnter = () => {
		// Clear both timers when the user hovers over the box
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		if (autoCloseTimeoutRef.current) {
			clearTimeout(autoCloseTimeoutRef.current);
			autoCloseTimeoutRef.current = null;
		}
	};

	const handleConfirm = () => {
		setConfirmDelete(false);
		onConfirm();
	};

	const handleOpen = () => {
		setConfirmDelete(true);

		// Set up the 3-second initial auto-close timer
		autoCloseTimeoutRef.current = setTimeout(() => {
			setConfirmDelete(false);
			onCancel(); // Notify parent of auto-cancellation
		}, 3000);
	};

	useEffect(() => {
		// Cleanup on component unmount
		return () => {
			if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
			if (autoCloseTimeoutRef.current)
				clearTimeout(autoCloseTimeoutRef.current);
		};
	}, []);

	return (
		<div className="relative">
			{type === "delete" ? (
				<button
					type="button"
					onClick={handleOpen}
					className={clsx(
						iconOutLine
							? "bg-transparent text-red-600  text-xs py-1 px-1 rounded hover:text-red-400"
							: "bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600",
						isProcessing && "opacity-50 cursor-not-allowed"
					)}
					disabled={isProcessing}>
					{isProcessing ? (
						<LoaderTiny />
					) : (
						<BiTrash className={iconOutLine ? "w-6 h-6" : "w-4 h-4"} />
					)}
				</button>
			) : type === "custom" ? (
				<button
					type="button"
					onClick={handleOpen}
					className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-2 py-1 rounded relative"
					disabled={isProcessing}>
					<span className={isProcessing ? "opacity-0" : "opacity-100"}>
						{customText}
					</span>
					<div className="w-full h-full top-0 left-0 absolute flex justify-center items-center">
						<span className={!isProcessing ? "opacity-0" : "opacity-100"}>
							<LoaderTiny />
						</span>
					</div>
				</button>
			) : null}

			{/* AnimatePresence handles mounting and unmounting animations */}
			<AnimatePresence>
				{confirmDelete && (
					<motion.div
						className="bg-black absolute -bottom-12 right-0 py-3 px-3 rounded-lg z-30 border-white/10 border"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						initial={{ opacity: 0, y: 20 }} // Start invisible and below the final position
						animate={{ opacity: 1, y: 0 }} // Animate to fully visible and in place
						exit={{ opacity: 0, y: 20 }} // Fade out and slide down when unmounted
						transition={{ duration: 0.3 }} // Smooth 300ms transition
					>
						{/* Message such as <p className="text-xs">Are you sure??</p> can be p[assed in optionally] */}
						{!!children && (
							<div className="mb-2 flex w-full text-nowrap">{children}</div>
						)}

						<div className="flex justify-center items-center gap-3 text-sm">
							<button
								type="button"
								onClick={handleConfirm}
								className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
								Yes
							</button>
							<button
								type="button"
								onClick={() => setConfirmDelete(false)}
								className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
								No
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ConfirmationPopover;
