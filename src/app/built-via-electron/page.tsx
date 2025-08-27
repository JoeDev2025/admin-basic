import BuiltViaElectron from "@/components/BuiltViaElectron/BuiltViaElectron";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { Metadata } from "next";
import { TbSolarElectricity } from "react-icons/tb";

const title = "Built via Electron";
const description =
	"Admin site and Website built via Electron - this shows you how, and lets you confirm everything is all correct!";

export const metadata: Metadata = {
	title,
	description,
};

export default function ProfileEditorPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={TbSolarElectricity}>
					<p>{description}</p>
				</PageHeader>

				<BuiltViaElectron />

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
