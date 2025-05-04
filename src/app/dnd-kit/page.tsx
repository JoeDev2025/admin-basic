import DndSortableGrid from "@/components/DndKit/DndSortableGrid";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { Metadata } from "next";
import { MdDragIndicator } from "react-icons/md";

const title = "Drag & Drop Sortable Grid";
const description = "Interactive drag and drop interface for reordering items in a grid layout using @dnd-kit.";

export const metadata: Metadata = {
	title,
	description,
};

export default function DndKitPage() {
	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={MdDragIndicator}>
					<p>
						{description}
					</p>
				</PageHeader>

				<DndSortableGrid />

				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}