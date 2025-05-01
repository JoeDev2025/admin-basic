import BlankComponent from "@/components/BlankComponent/BlankComponent";
import TodoList from "@/components/TodoList/TodoList";
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

export default function TodoListPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={FaPencil}>
					<p>
						{description}
					</p>
				</PageHeader>

				<TodoList />

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
