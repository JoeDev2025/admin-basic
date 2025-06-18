import { FaHome, FaKeycdn } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdDragIndicator } from "react-icons/md";

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
		icon: MdDragIndicator,
		label: "Drag & Drop",
		route: "/dnd-kit",
	},
];
