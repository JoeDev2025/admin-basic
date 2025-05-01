import { Highlight, PrismTheme } from "prism-react-renderer";
import { useState } from "react";

type HowToUseProps = {
	title: string;
	description: string;
	codeToDisplay: string;
};

export const HowToUse = (props: HowToUseProps) => {
	const { title, description, codeToDisplay } = props;
	const [isMinified, setIsMinified] = useState(false);
	return (
		<div className="relative w-full rounded-xl bg-zinc-800 shadow-xl">
			<div className="flex w-full gap-2 rounded-t-xl bg-zinc-900 p-3 items-center">
				<div className="h-3 w-3 rounded-full bg-red-500" />
				<div className="h-3 w-3 rounded-full bg-yellow-500 flex justify-center items-center group hover:bg-yellow-600">
					<span
						onClick={() => setIsMinified(!isMinified)}
						className="cursor-pointer text-yellow-500 text-base font-light hidden group-hover:block ">
						-
					</span>
				</div>
				<div className="h-3 w-3 rounded-full bg-green-500" />
				<span
					className="ml-1 cursor-pointer"
					onClick={() => setIsMinified(!isMinified)}>
					{title}
				</span>
			</div>
			{!isMinified && (
				<div className="p-2">
					<div className="font-mono text-sm text-slate-200">
						<Markup code={codeToDisplay} />
					</div>

					<div className="text-sm py-2 font-light text-slate-300">
						{description}
					</div>
				</div>
			)}
		</div>
	);
};

type MarkupProps = {
	code: string;
};

export const Markup = ({ code }: MarkupProps) => {
	return (
		<Highlight theme={theme} code={code} language="javascript">
			{({ style, tokens, getLineProps, getTokenProps }) => (
				<pre
					style={style}
					className=" text-wrap text-xs flex flex-col py-2 bg-emerald-500/5">
					{tokens.map((line, i) => (
						<div
							key={i}
							{...getLineProps({ line })}
							className=" pl-0.5 flex flex-row">
							<span className="inline-block w-[20px] select-none text-slate-400 mr-2 ml-1">
								{i + 1}
							</span>
							{line.map((token, key) => (
								<span key={key} {...getTokenProps({ token })} className="" />
							))}
						</div>
					))}
				</pre>
			)}
		</Highlight>
	);
};

const theme: PrismTheme = {
	plain: {
		color: "#e2e8f0",
		// backgroundColor: "transparent",
	},
	styles: [
		{
			types: ["comment"],
			style: {
				color: "rgb(100, 200, 100))",
				fontStyle: "italic",
			},
		},
		{
			types: ["string", "inserted"],
			style: {
				color: "rgb(195, 232, 141)",
			},
		},
		{
			types: ["number"],
			style: {
				color: "rgb(247, 140, 108)",
			},
		},
		{
			types: ["builtin", "char", "constant", "function"],
			style: {
				color: "rgb(130, 170, 255)",
			},
		},
		{
			types: ["punctuation", "selector"],
			style: {
				color: "rgb(199, 146, 234)",
			},
		},
		{
			types: ["variable"],
			style: {
				color: "rgb(191, 199, 213)",
			},
		},
		{
			types: ["class-name", "attr-name"],
			style: {
				color: "rgb(255, 203, 107)",
			},
		},
		{
			types: ["tag", "deleted"],
			style: {
				color: "rgb(255, 85, 114)",
			},
		},
		{
			types: ["operator"],
			style: {
				color: "rgb(137, 221, 255)",
			},
		},
		{
			types: ["boolean"],
			style: {
				color: "rgb(255, 88, 116)",
			},
		},
		{
			types: ["keyword"],
			style: {
				fontStyle: "italic",
			},
		},
		{
			types: ["doctype"],
			style: {
				color: "rgb(199, 146, 234)",
				fontStyle: "italic",
			},
		},
		{
			types: ["namespace"],
			style: {
				color: "rgb(178, 204, 214)",
			},
		},
		{
			types: ["url"],
			style: {
				color: "rgb(221, 221, 221)",
			},
		},
		{
			types: ["keyword", "variable"],
			style: {
				color: "#c792e9",
				fontStyle: "normal",
			},
		},
	],
};
