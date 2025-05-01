"use client";
import { supabaseCLIENT } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";
import { LoaderTiny } from "../UI/Loaders";

export default function ProfileUsersEmail() {
	const [userEmail, setUserEmail] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const { authState } = useAuthModal();
	const { user } = authState;

	// console.log("⭐", user);

	const { email } = user || {};

	useEffect(() => {
		setUserEmail(email || "");
	}, [email]);

	const handleEmailUpdate = async () => {
		setIsLoading(true);
		setError(null);
		// Update user profile
		const { data, error } = await supabaseCLIENT.auth.updateUser({
			email: userEmail, // edit both full_name and displayName
		});
		if (error) setError(error.message);
		else {
			setStatusMessage(
				`Please click link in ${data.user.new_email} inbox to verify email`
			);
		}
		setIsLoading(false);
	};

	return (
		// Users Full name & Display Name
		<div>
			<label className="mb-3 block text-sm font-medium ">Your Email</label>
			<input
				type="email"
				value={userEmail}
				onChange={(e) => setUserEmail(e.target.value)}
				placeholder="Email Address"
				className="w-full text-sm rounded-lg border bg-black px-5 py-3 text-white outline-none transition focus:border-sky-800 active:border-primary disabled:cursor-default disabled:bg-white/10"
			/>
			{userEmail !== email && (
				<div className="flex justify-end mt-2">
					<button className="text-xs text-sky-500" onClick={handleEmailUpdate}>
						{isLoading ? <LoaderTiny /> : <span>Update</span>}
					</button>
				</div>
			)}

			{error && (
				<div className="flex items-center gap-2 mt-2 text-red-500">
					<CiWarning />
					<span>{error}</span>
				</div>
			)}
			{statusMessage && (
				<div className="flex items-center gap-2 mt-2 text-green-500 text-xs">
					<span>{statusMessage}</span>
				</div>
			)}
		</div>
	);
}
