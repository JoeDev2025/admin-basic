"use client";

import { supabaseCLIENT } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";
import { LoaderTiny } from "../UI/Loaders";

export default function ProfileUsersAuthorSummary() {
	const [authorSummary, setAuthorSummary] = useState<string | null>("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { authState, refreshAuthState } = useAuthModal();
	const { user, adminData } = authState;
	const { author_summary } = adminData || { author_summary: null };

	useEffect(() => {
		setAuthorSummary(author_summary);
	}, [author_summary]);

	// Handle Name Change
	const handleAuthorSummaryChange = async () => {
		if (!user || !user.id) {
			setError("User not authenticated.");
			return;
		}
		setIsLoading(true);
		setError(null);
		// Update
		const { error } = await supabaseCLIENT
			.from("user_admin_view")
			.update({ author_summary: authorSummary })
			.eq("user_id", user.id);

		if (error) setError(error.message);
		refreshAuthState();
		setIsLoading(false);
	};

	return (
		// Users Full name & Display Name
		<div>
			<label className="mb-3 block text-sm font-medium ">
				Author Summary{" "}
				<span className="text-xs text-zinc-400 ml-2">
					For the blog articles!
				</span>
			</label>
			<textarea
				value={authorSummary || ""}
				onChange={(e) => setAuthorSummary(e.target.value)}
				placeholder="Full Name"
				className="w-full text-sm rounded-lg border bg-black px-5 py-3 text-white outline-none transition focus:border-sky-800 active:border-primary disabled:cursor-default disabled:bg-white/10"
			/>
			{authorSummary !== author_summary && (
				<div className="flex justify-end mt-2">
					<button
						className="text-xs text-sky-500"
						onClick={handleAuthorSummaryChange}>
						{isLoading ? <LoaderTiny /> : <span>Save</span>}
					</button>
				</div>
			)}
			{error && (
				<div className="flex items-center gap-2 mt-2 text-red-500">
					<CiWarning />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
}
