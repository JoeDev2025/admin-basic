import { supabaseCLIENT } from "@/lib/supabaseClient";
import SecureEncryptButton from "../Buttons/SecureEncryptButton";
import { SetFormTypeProps } from "./AuthModal";
import { HeadingAuth } from "./Shared/HeadingAuth";

export const ForgotPasswordForm = ({ setFormType }: SetFormTypeProps) => {
	return (
		<>
			<HeadingAuth type="forgotpassword" setFormType={setFormType} />
			<Email />
		</>
	);
};

const Email = () => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();

				// Send the reset password email
				const email = e.currentTarget.email.value;
				await supabaseCLIENT.auth.resetPasswordForEmail(email, {
					redirectTo: undefined,
				});
			}}>
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
					placeholder="your.email@provider.com"
					className="w-full rounded-md border border-zinc-400 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
				/>
			</div>

			<SecureEncryptButton colorStyle="orange" btnText="Send me a reset code" />
		</form>
	);
};
