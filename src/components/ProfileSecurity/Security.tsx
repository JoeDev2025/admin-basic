"use client";
import SecurityChangePassword from "./SecurityChangePassword";
import SecurityMFA from "./SecurityMFA";

export default function Security() {
	return (
		<div className="flex flex-col gap-9">
			{/* <!-- Input Fields --> */}
			<div className="rounded border border-stroke  shadow-md dark:border-zinc-600 dark:bg-zinc-900">
				<div className="border-b px-6 py-4 dark:border-zinc-800">
					<h3 className="font-medium ">Account Security</h3>
				</div>
				<div className="flex flex-col gap-5 p-6">
					<SecurityChangePassword />
					<SecurityMFA />
				</div>
			</div>
		</div>
	);
}
