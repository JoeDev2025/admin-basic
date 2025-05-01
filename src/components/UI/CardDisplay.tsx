import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import React from "react";
import StatsCountDown from "./StatsCountDown";

type CardDisplayProps = {
	icon: React.ElementType;
	children?: React.ReactNode;
	title: string;
	value: number;
	prefix?:
		| "$"
		| "R$"
		| "€"
		| "£"
		| "¥"
		| "₹"
		| "₽"
		| "₩"
		| "₪"
		| "₴"
		| "₸"
		| "₺"
		| "₼"
		| "₾"
		| "₿";
	suffix?: "%" | "+" | "-" | "K" | "M" | "B" | "T" | "kb" | "mb" | "gb" | "tb";
	valueDesc?: string;
	rateChange: "unchanged" | "up" | "down";
	rate?: string;
};

const CardDisplay = (props: CardDisplayProps) => {
	const { icon, title, value, prefix, suffix, valueDesc, rate, rateChange } =
		props;
	const Icon = icon;
	return (
		<div className="rounded-sm border border-stroke  px-7 py-6 shadow-md border-0.5 border-white/10 bg-zinc-900 w-full">
			{/* Top part */}
			<div className="flex items-center justify-start gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl">
					<Icon className="text-white w-6 h-6" />
				</div>
				<h4>{title}</h4>
			</div>

			{/* Bottom part */}
			<div className="mt-4">
				<div>
					<h4
						className="text-2xl font-bold text-white truncate w-full"
						title={`${prefix ? prefix : ""}${value}${suffix ? suffix : ""}`}>
						<StatsCountDown num={value} prefix={prefix} suffix={suffix} />
					</h4>
				</div>

				<div className="mt-4 flex items-end justify-between">
					<span className="text-sm font-light text-zinc-300">{valueDesc}</span>
					<span
						className={`flex items-center gap-1 text-sm font-medium ${
							rateChange === "up"
								? "text-emerald-500"
								: rateChange === "down"
								? "text-rose-500"
								: "text-zinc-300"
						}`}>
						{rate}

						{rateChange === "up" ? (
							<FaCaretUp className="text-emerald-500" />
						) : rateChange === "down" ? (
							<FaCaretDown className="text-rose-500" />
						) : (
							""
						)}
					</span>
				</div>
			</div>
		</div>
	);
};



export default CardDisplay;
