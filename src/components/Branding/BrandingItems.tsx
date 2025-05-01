import { motion } from "framer-motion";
import { SiAnkermake } from "react-icons/si";
export function BrandingHeader() {
	return (
		<div className="flex gap-x-3 items-center text-2xl relative">
			{/* Animate the Flutter logo */}
			<motion.div
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<SiAnkermake className="w-8 h-8 text-sky-500" />
			</motion.div>

			{/* Animate the text with a delay */}
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}>
				Maake{" "}
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="text-sky-500">
					It
					<span className="absolute text-xs text-pink-500 -top-2 -right-12 animate-pulse">
						ADMIN
					</span>
				</motion.span>
			</motion.span>
		</div>
	);
}
