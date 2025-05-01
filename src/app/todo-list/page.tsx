import BlankComponent from "@/components/BlankComponent/BlankComponent";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { Metadata } from "next";
import { FaRegMehBlank } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const title = "TODO List";
const description = "Create a TODO list.";

export const metadata: Metadata = {
	title,
	description,
};

export default function ProfileEditorPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={FaPencil}>
					<p>
						{description}
					</p>
				</PageHeader>

				<h1>Welcome to Todo List</h1>

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
