import Profile from "@/components/ProfileSecurity/Profile";
import Security from "@/components/ProfileSecurity/Security";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { Metadata } from "next";
import { FaUser } from "react-icons/fa";

export const metadata: Metadata = {
	title: "Profile & Security",
	description: "Edit your admin profile information",
};

export default function ProfileEditorPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title="Profile & Security" icon={FaUser}>
					<p>Here you will be able to edit your admin profile information</p>
				</PageHeader>

				<div className="grid grid-cols-1 gap-9 sm:grid-cols-2 mt-6">
					<Profile />
					<Security />
				</div>

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
