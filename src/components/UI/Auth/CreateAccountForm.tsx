import { supabaseCLIENT } from "@/lib/supabaseClient";
import SecureEncryptButton from "../Buttons/SecureEncryptButton";
import { Divider } from "../Divider";

import { useRef, useState } from "react";
import { SetFormTypeProps } from "./AuthModal";
import { HeadingAuth } from "./Shared/HeadingAuth";
import { ErrorPopUp, SuccessPopUp } from "./Shared/InlineSuccessErrorPopUps";

export const CreateAccountForm = ({ setFormType }: SetFormTypeProps) => {
	return (
		<>
			<HeadingAuth type="register" setFormType={setFormType} />

			<Divider />
			<EmailPassword setFormType={setFormType} />
		</>
	);
};

const EmailPassword = ({ setFormType }: SetFormTypeProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Add a ref form the form
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setLoading(true);

		if (password !== repeatPassword) {
			setError("Passwords do not match");
			return;
		}
		if (email.length < 1) {
			setError("Email cannot be empty");
			return;
		}

		const { data, error } = await supabaseCLIENT.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: undefined, // The page to redirect to after email verification
			},
		});
		if (error) {
			console.error("Error signing up:", error.message);
			setError(error.message);
			setLoading(false);
			return;
		}
		console.log("Success signing up:", data);
		setSuccess("Success! Please check your email to confirm your account.");
		setFormType("checkemail");

		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} ref={formRef}>
			<div className="mb-3">
				<label
					htmlFor="email-input"
					className="mb-2 block text-zinc-600 dark:text-zinc-400">
					Email
				</label>
				<input
					id="email-input"
					name="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="your.email@provider.com"
					className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
				/>
			</div>
			<div className="flex flex-col md:flex-row w-full justify-between gap-x-2 mb-3">
				<div className="flex-1 mb-3">
					<div className="mb-2 flex items-end justify-between">
						<label
							htmlFor="password-input"
							className="block text-zinc-600 dark:text-zinc-400">
							Password
						</label>
					</div>
					<input
						id="password-input"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
					/>
				</div>
				<div className="flex-1 mb-3">
					<div className="mb-2 flex items-end justify-between">
						<label
							htmlFor="password-input"
							className="block text-zinc-600 dark:text-zinc-400">
							Repeat Password
						</label>
					</div>
					<input
						id="repeat-input"
						name="password-repeat"
						type="password"
						value={repeatPassword}
						onChange={(e) => setRepeatPassword(e.target.value)}
						placeholder="••••••••••••"
						className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
					/>
				</div>
			</div>

			{error && <ErrorPopUp error={error} setError={setError} />}
			{success && <SuccessPopUp message={success} setMessage={setSuccess} />}

			<SecureEncryptButton
				isLoadingState={loading}
				colorStyle="green"
				btnText="Register New Account"
				onClick={() => {
					// submit parent form
					formRef.current?.dispatchEvent(
						new Event("submit", { cancelable: true, bubbles: true })
					);
				}}
			/>
		</form>
	);
};

/**
 * Example of data returned from signing up a new user.
 * After signup the user will get an email to confirm, which will redirect back to the site.
 * {
    "id": "be25aac2-f7f9-4a11-9c66-f48605ccd080",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "tobin.chew89@gmail.com",
    "phone": "",
    "confirmation_sent_at": "2024-11-07T20:09:19.242875679Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {
        "email": "tobin.chew89@gmail.com",
        "email_verified": false,
        "phone_verified": false,
        "sub": "be25aac2-f7f9-4a11-9c66-f48605ccd080"
    },
    "identities": [
        {
            "identity_id": "0f8d9906-222b-4419-8c4f-6ec6599ae5ac",
            "id": "be25aac2-f7f9-4a11-9c66-f48605ccd080",
            "user_id": "be25aac2-f7f9-4a11-9c66-f48605ccd080",
            "identity_data": {
                "email": "tobin.chew89@gmail.com",
                "email_verified": false,
                "phone_verified": false,
                "sub": "be25aac2-f7f9-4a11-9c66-f48605ccd080"
            },
            "provider": "email",
            "last_sign_in_at": "2024-11-07T20:09:19.238672681Z",
            "created_at": "2024-11-07T20:09:19.23872Z",
            "updated_at": "2024-11-07T20:09:19.23872Z",
            "email": "tobin.chew89@gmail.com"
        }
    ],
    "created_at": "2024-11-07T20:09:19.233472Z",
    "updated_at": "2024-11-07T20:09:19.603845Z",
    "is_anonymous": false
}
 */
