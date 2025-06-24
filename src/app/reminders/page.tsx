import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { supabaseBACKEND } from "@/lib/api-utils/API-BACKEND-CLIENT";
import { Metadata } from "next";
import { FaRegMehBlank } from "react-icons/fa";

const title = "Reminders";
const description = "Check all the reminders here";

export const metadata: Metadata = {
	title,
	description,
};

export type Reminder = {
	reminder_id: string;
	user_id: string;
	title: string | null;
	description: string;
};

export default async function RemindersPage() {
	//REVIEW Used supabaseBACKEND to bypass RLS policies with SERVICE_ROLE_KEY. Is this the idea?

	// NOTE Since I could not find a way to get the current auth user, I hardcoded it
	const userId = 'b658464c-81ad-4993-ad3b-5527f98749db';

	//fetch authenticated user using hardcoded value
	const { data } = await supabaseBACKEND.from('admin_users')
		.select('admin_role')
		.eq('user_id', userId)
		.single();

	//fetch reminders only if the admin_role is 'super_admin'
	let reminders: Reminder[] = [];
	if (data?.admin_role === 'super_admin') { //NOTE On hardcoded solution, change this to test (standard, admin or super_admin)
		const { data } = await supabaseBACKEND.from('reminders')
			.select()
			.order('user_id', { ascending: false }) as { data: Reminder[] | [] };

		reminders = data || [];
	}

	return (
		<DefaultLayout>
			<PageProtected>
				{/* START Your content goes here */}

				<PageHeader title={title} icon={FaRegMehBlank}>
					<p>
						{description}
					</p>
				</PageHeader>
				<ul className="flex flex-col gap-4">
					{reminders.length >= 1 ?
						<div>
							{reminders.map(reminder =>
								<div key={reminder.reminder_id} className="flex flex-col border max-w-xl p-2">
									<span className="truncate max-w-40 text-red-400">User ID: {reminder.user_id}</span>
									<h2 className="text-center mb-2">Title: {reminder.title}</h2>
									<p className="dark:bg-gray-800 p-2">{reminder.description}</p>
								</div>
							)}
						</div>
						: <div>
							<p className="text-red-400">No reminders were created</p>
							<p className="text-red-600">Or maybe you do not have super_admin permissions</p>
						</div>
					}
				</ul>


				{/* END Your content goes here */}
			</PageProtected>
		</DefaultLayout>
	);
}
