type PageHeaderProps = {
	title: string;
	children?: React.ReactNode;
	icon?: React.ElementType;
};
export default function PageHeader({ title, children, icon }: PageHeaderProps) {
	const Icon = icon || null;
	return (
		<div className="flex flex-col items-start gap-2 mb-4">
			<h1 className="text-2xl font-semibold flex flex-row items-center gap-3">
				{Icon && <Icon className="w-6 h-6 text-pink-500" />}
				{title}
			</h1>
			<div className="font-light">{children}</div>
		</div>
	);
}
