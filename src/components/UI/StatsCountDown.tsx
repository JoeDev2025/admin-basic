import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

type StatProps = {
	num: number;
	prefix?: string;
	suffix?: string;
};

// Note this reads the number of decimals passed to the function and rounds the number to that amount of decimals before converting to a string and then
// apply the Intl.NumberFormat to format the number with commas and the correct currency symbol.

const StatsCountDown = ({ num, prefix, suffix }: StatProps) => {
	const ref = useRef<HTMLSpanElement | null>(null);
	const isInView = useInView(ref);

	useEffect(() => {
		if (!isInView) return;

		const isNumFloatWithDecimals = num % 1 !== 0;
		const decimalsCount = isNumFloatWithDecimals
			? num.toString().split(".")[1].length
			: 0;

		function roundNumberToDecimals(num: number, decimals: number) {
			return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
		}

		animate(0, num, {
			duration: 2.5,
			onUpdate(value) {
				if (!ref.current) return;

				const valueAsString = value.toFixed(0);
				const formattedValue = new Intl.NumberFormat().format(
					isNumFloatWithDecimals
						? roundNumberToDecimals(value, decimalsCount)
						: parseFloat(valueAsString)
				);
				ref.current.textContent = formattedValue;
			},
		});
	}, [num, isInView]);

	return (
		<span className="inline-flex gap-x-0.5 items-end">
			{!!prefix && <span className="text-zinc-400 text-xl">{prefix}</span>}
			<span ref={ref}></span>
			{!!suffix && <span className="text-zinc-400 text-xl">{suffix}</span>}
		</span>
	);
};

export default StatsCountDown;
