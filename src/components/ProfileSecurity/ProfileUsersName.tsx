"use client";
import { supabaseCLIENT } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";
import { LoaderTiny } from "../UI/Loaders";

export default function ProfileUsersName() {
	const [userFullName, setUserFullName] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { authState, refreshAuthState } = useAuthModal();
	const { user } = authState;
	const { email, user_metadata } = user || {};
	const { displayName } = user_metadata || {};

	useEffect(() => {
		setUserFullName(displayName);
	}, [displayName, email]);

	// Handle Name Change
	const handleNameChange = async () => {
		setIsLoading(true);
		setError(null);
		// Update user profile
		const { data, error } = await supabaseCLIENT.auth.updateUser({
			data: { full_name: userFullName, displayName: userFullName }, // edit both full_name and displayName
		});
		if (error) setError(error.message);
		if (data) {
			refreshAuthState();
		}
		setIsLoading(false);
	};

	return (
		// Users Full name & Display Name
		<div>
			<label className="mb-3 block text-sm font-medium ">Your Full Name</label>
			<input
				type="text"
				value={userFullName}
				onChange={(e) => setUserFullName(e.target.value)}
				placeholder="Full Name"
				className="w-full text-sm rounded-lg border bg-black px-5 py-3 text-white outline-none transition focus:border-sky-800 active:border-primary disabled:cursor-default disabled:bg-white/10"
			/>
			{userFullName !== displayName && (
				<div className="flex justify-end mt-2">
					<button className="text-xs text-sky-500" onClick={handleNameChange}>
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
