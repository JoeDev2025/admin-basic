import BlankComponent from "@/components/BlankComponent/BlankComponent";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { Metadata } from "next";
import { FaRegMehBlank } from "react-icons/fa";

const title = "Built via Electron";
const description = "Built Via Electron";

export const metadata: Metadata = {
	title,
	description,
};

export default function ProfileEditorPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={FaRegMehBlank}>
					<p>
						{description}
					</p>
				</PageHeader>

				<BlankComponent />

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
