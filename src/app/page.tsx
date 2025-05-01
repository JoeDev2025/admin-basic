"use client";

import UserTable from "@/components/AllUsers/UserTable";
import { AdminOnly } from "@/components/UI/Auth/AdminOnly";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { FaHome } from "react-icons/fa";

/*
Page layout basic demo
To edit the side menu - edit the file: app/components/UI/SideMenu.tsx
*/

export default function Home() {
	return (
		<DefaultLayout>
			{/* START Your content goes here */}
			<PageProtected>
				<PageHeader title="Maake It Admin Site" icon={FaHome}>
					<p>
						Welcome to the internal Admin Site for managing all sorts of things
					</p>
				</PageHeader>

				{/* List all users */}
				<AdminOnly access_level="admin" display_blocked_message={false}>
					<UserTable userType="admin" />
					<UserTable userType="customer" />
				</AdminOnly>
			</PageProtected>
			{/* END Your content goes here */}
		</DefaultLayout>
	);
}
