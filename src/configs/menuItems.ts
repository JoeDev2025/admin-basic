import { BiCog, BiSolidCog } from "react-icons/bi";
import { FaHome, FaKeycdn } from "react-icons/fa";

type MenuItem = {
	icon?: React.ElementType;
	iconExpanded?: React.ElementType;
	label: string;
	route?: string;
	children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
	{
		icon: FaHome,
		label: "Home",
		route: "/",
	},
	{
		icon: FaKeycdn,
		label: "Media CDN",
		route: "/media-cdn",
	},
	{
		icon: BiCog,
		iconExpanded: BiSolidCog,
		label: "Settings",
		children: [
			{
				label: "Profile & Account",
				route: "/profile",
			},
		],
	},
];
