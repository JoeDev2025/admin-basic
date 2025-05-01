import ProfileUsersAuthorSummary from "./ProfileUsersAuthorSummary";
import ProfileUsersEmail from "./ProfileUsersEmail";
import ProfileUsersImage from "./ProfileUsersImage";
import ProfileUsersName from "./ProfileUsersName";

export default function Profile() {
	return (
		<div className="flex flex-col gap-9">
			<div className="rounded border border-stroke  shadow-md dark:border-zinc-600 dark:bg-zinc-900">
				<div className="border-b px-6 py-4 dark:border-zinc-800">
					<h3 className="font-medium ">Profile Information</h3>
				</div>
				<div className="flex flex-col gap-5 p-6">
					<div className="flex flex-row gap-2 items-end">
						<div className="flex-1">
							<ProfileUsersName />
						</div>
						<div className="w-16 flex items-center justify-center -mb-2">
							<ProfileUsersImage />
						</div>
					</div>
					<ProfileUsersEmail />
					<ProfileUsersAuthorSummary />
				</div>
			</div>
		</div>
	);
}
