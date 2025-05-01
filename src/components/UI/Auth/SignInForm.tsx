import { useRef, useState } from "react";

import { supabaseCLIENT } from "@/lib/supabaseClient";
import SecureEncryptButton from "../Buttons/SecureEncryptButton";
import { SetFormTypeProps } from "./AuthModal";
import { useAuthModal } from "./AuthModlProvider";
import { HeadingAuth } from "./Shared/HeadingAuth";
import { ErrorPopUp, SuccessPopUp } from "./Shared/InlineSuccessErrorPopUps";

export const SignInForm = ({ setFormType }: SetFormTypeProps) => {
	return (
		<>
			<HeadingAuth type="signin" setFormType={setFormType} />
			<EmailPassword setFormType={setFormType} />
		</>
	);
};

const EmailPassword = ({ setFormType }: SetFormTypeProps) => {
	const { closeAuthModal, refreshAuthState } = useAuthModal();
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState<string | null>(null);
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Add a ref form the form
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabaseCLIENT.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				throw error;
			}
			setSuccess("Successfully signed in!");
			refreshAuthState();
			closeAuthModal();
			console.log(data);
		} catch (err: unknown) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
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
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="your.email@provider.com"
					className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
				/>
			</div>
			<div className="mb-6">
				<div className="mb-2 flex items-end justify-between">
					<label
						htmlFor="password-input"
						className="block text-zinc-600 dark:text-zinc-400">
						Password
					</label>
					<button
						onClick={() => setFormType("forgotpassword")}
						className="text-sm text-blue-400">
						Forgot?
					</button>
				</div>
				<input
					id="password-input"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••••••"
					className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
				/>
			</div>

			{error && <ErrorPopUp error={error} setError={setError} />}
			{success && <SuccessPopUp message={success} setMessage={setSuccess} />}

			<SecureEncryptButton
				colorStyle="blue"
				btnText="Sign In Securely"
				isLoadingState={loading}
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
