"use client";

import { FC } from "react";
import { useAuthModal } from "./AuthModlProvider";

type AdminOnlyProps = {
	access_level: "admin" | "super_admin";
	display_blocked_message?: boolean;
	children: React.ReactNode;
};

export const AdminOnly: FC<AdminOnlyProps> = ({
	access_level,
	display_blocked_message,
	children,
}) => {
	const { authState } = useAuthModal();
	const { adminData } = authState;
	const current_role = adminData?.admin_role || null;

	if (
		(current_role === "admin" && access_level === "admin") ||
		current_role === "super_admin"
	) {
		return <>{children}</>;
	} else if (display_blocked_message) {
		return (
			<div className="p-2 border border-red-600/30 bg-red-500/5 rounded-md text-sm">
				<span className="text-red-100 animate-pulse">
					You do not have the required access level to view this component
				</span>
			</div>
		);
	} else {
		return null;
	}
};
