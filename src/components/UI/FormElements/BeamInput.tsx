import {
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { FiArrowRight } from "react-icons/fi";
import { LoaderTiny } from "../Loaders";

/**
   IMPORTANT!!
  
   This component requires the following class for cross browser masking support
  
  .mask-with-browser-support {
    mask: linear-gradient(black, black), linear-gradient(black, black);
    mask-clip: content-box, border-box;
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(black, black) content-box,
      linear-gradient(black, black);
    -webkit-mask-clip: content-box, border-box;
    -webkit-mask-composite: xor;
  }
   */

type BeamInputProps = {
	placeholder?: string;
	onChangeText: (value: string) => void;
	onSave: () => void;
	isSaving: boolean;
};

const BeamInput = (props: BeamInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		placeholder = "Type something",
		onChangeText,
		onSave,
		isSaving,
	} = props;

	const turn = useMotionValue(0);

	useEffect(() => {
		animate(turn, 1, {
			ease: "linear",
			duration: 5,
			repeat: Infinity,
		});
	}, []);

	const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, #a78bfa00 75%, #0F93CF 100%)`;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
			}}
			onClick={() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}}
			className="relative flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 bg-gradient-to-br from-black/10 to-white/5 hover:to-green-500/5 py-1.5 pl-6 pr-1.5 group">
			{inputRef.current &&
				inputRef.current.value &&
				inputRef.current.value.length > 0 && (
					<div className="hidden group-hover:flex absolute top-0 left-0 w-full">
						<div className="absolute bg-sky-900 bottom-1 rounded-md z-30 text-xs px-2 py-1 left-6">
							{placeholder}
						</div>
						<BiSolidDownArrow className="text-sky-900 w-4 h-4 z-40 absolute -bottom-2 left-8" />
					</div>
				)}

			<input
				ref={inputRef}
				type="text"
				placeholder={placeholder}
				onChange={(e) => onChangeText(e.target.value)}
				className="w-full bg-transparent text-xs text-white placeholder-white/80 focus:outline-0 placeholder:text-zinc-500"
			/>

			<button
				onClick={(e) => {
					e.stopPropagation();
					onSave();
				}}
				type="submit"
				className="group flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-sky-700 to-sky-500 px-4 py-3 text-sm font-medium text-white transition-transform active:scale-[0.985]">
				<span>Save</span>
				{isSaving ? (
					<LoaderTiny />
				) : (
					<FiArrowRight className="-mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45 w-4 h-4" />
				)}
			</button>

			<div className="pointer-events-none absolute inset-0 z-10 rounded-full">
				<motion.div
					style={{
						backgroundImage,
					}}
					className="mask-with-browser-support absolute -inset-[1px] rounded-full border border-transparent bg-origin-border"
				/>
			</div>
		</form>
	);
};

export default BeamInput;
