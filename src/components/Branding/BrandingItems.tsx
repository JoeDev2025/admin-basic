import { motion } from "framer-motion";
import Image from "next/image";
export function BrandingHeader() {
	return (
		<div className="flex gap-x-3 items-center text-2xl relative">
			{/* Main Logo PNG */}
			<motion.div
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<Image
					src="/main-logo-dark-lg.png"
					alt="logo"
					width={480}
					height={64}
				/>
			</motion.div>

			{/* Admin Text above logo to show its the ADMIN site */}
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.6 }}
				className="">
				<span className="absolute text-xs text-pink-500 top-1 right-3 rotate-12 animate-pulse">
					ADMIN
				</span>
			</motion.span>
		</div>
	);
}
