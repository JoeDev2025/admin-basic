import { supabaseCLIENT } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import SecureEncryptButton from "../Buttons/SecureEncryptButton";
import { LoaderLarge } from "../Loaders";
import { SetFormTypeProps } from "./AuthModal";
import { CodeInput6Digits } from "./Shared/CodeInput6Digits";
import { HeadingAuth } from "./Shared/HeadingAuth";

export const EnterCodeForm = ({ setFormType }: SetFormTypeProps) => {
	return (
		<>
			<HeadingAuth type="entercode" setFormType={setFormType} />
			<EnterCode />
		</>
	);
};

const EnterCode = () => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [factorId, setFactorId] = useState<string | null>(null);
	const [challengeId, setChallengeId] = useState<string | null>(null);
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [code, setCode] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	// List factors and handle automatic unenrollment for unverified factors
	async function listFactors() {
		setLoading(true);
		setErrorMsg(null);

		const { data, error } = await supabaseCLIENT.auth.mfa.listFactors();

		if (error) {
			console.log("listFactors()" + error.message);
			setErrorMsg(error.message);
		} else if (data?.all?.length > 0) {
			const unverifiedFactor = data.all.find(
				(factor) =>
					factor.status === "unverified" && factor.factor_type === "totp"
			);

			if (unverifiedFactor) {
				// Automatically unenroll unverified factor and start enrollment
				await unenrollTOTP(unverifiedFactor.id);
				await enrollTOTP();
			} else {
				const verifiedFactor = data.all.find(
					(factor) =>
						factor.status === "verified" && factor.factor_type === "totp"
				);

				if (verifiedFactor) {
					setFactorId(verifiedFactor.id);
					setIsVerified(true);
					setQrCode(null);
				} else {
					// No unverified or verified TOTP factors found
					setQrCode(null);
					setFactorId(null);
					setIsVerified(false);
				}
			}
		} else {
			// No factors exist
			setQrCode(null);
			setFactorId(null);
			setIsVerified(false);
		}
		setLoading(false);
	}

	// Automatically initiate a challenge
	async function initiateChallenge(factorId: string) {
		const { data, error } = await supabaseCLIENT.auth.mfa.challenge({
			factorId,
		});

		if (error) {
			setErrorMsg(error.message);
		} else if (data) {
			setChallengeId(data.id); // Use data.id as the challengeId
			setErrorMsg(null);
		}
	}
	// Enroll a new TOTP factor
	async function enrollTOTP() {
		setErrorMsg(null);
		setLoading(true);

		const { data, error } = await supabaseCLIENT.auth.mfa.enroll({
			factorType: "totp",
		});

		if (error) {
			console.log("enrollTOTP()" + error.message);
			setErrorMsg(error.message);
		} else {
			setQrCode(data.totp.qr_code);
			setFactorId(data.id);
			setIsVerified(false);
			setErrorMsg(null);
			// Automatically initiate challenge after enrollment
			await initiateChallenge(data.id);
		}

		setLoading(false);
	}

	// Verify the code entered by the user
	async function verifyCode() {
		if (!factorId || !code || !challengeId) {
			setErrorMsg("Missing factor ID, code, or challenge ID.");
			return;
		}
		setLoading(true);

		const { error } = await supabaseCLIENT.auth.mfa.verify({
			factorId,
			challengeId,
			code,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			setErrorMsg(null);
			setQrCode(null);
			setChallengeId(null);
			setIsVerified(true);
			alert("MFA successfully verified!");
		}

		setLoading(false);
	}

	// Unenroll a specific TOTP factor
	async function unenrollTOTP(factorId: string) {
		const { error } = await supabaseCLIENT.auth.mfa.unenroll({
			factorId,
		});

		if (error) {
			setErrorMsg(error.message);
		}
	}

	useEffect(() => {
		listFactors();
	}, []);

	const handleCodeChange = (value: string) => {
		setCode(value);
	};

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<div className="mb-3 relative">
				{loading && (
					<div className="w-40 h-40 flex items-center justify-center mx-auto">
						<LoaderLarge />
					</div>
				)}
				{qrCode ? (
					<div className="flex justify-center my-3">
						<img
							src={qrCode}
							alt="Scan this QR code"
							className="w-56 h-56382284"
						/>
					</div>
				) : (
					<div className="flex justify-center">
						<button
							onClick={enrollTOTP}
							className="bg-sky-600 hover:bg-sky-700 text-white rounded-md py-1 px-4 mt-2">
							Create a new QR Code
						</button>
					</div>
				)}
				{errorMsg && (
					<div className="text-red-500 text-sm mb-2">{errorMsg}</div>
				)}
				{qrCode && (
					<>
						<label
							htmlFor="code-input"
							className="mb-2 block text-zinc-600 dark:text-zinc-400">
							Scan the QR code with your authenticator app and enter the code
							below to verify:
						</label>
						<div className="flex justify-center py-2">
							<CodeInput6Digits onCodeChange={handleCodeChange} />
						</div>
						<SecureEncryptButton
							colorStyle="green"
							btnText="Verify Code"
							onClick={verifyCode}
						/>
					</>
				)}
				{isVerified && (
					<div className="mt-4">
						<p className="text-gray-600">
							An existing verified TOTP factor is active. You can unenroll it to
							create a new one.
						</p>
						<SecureEncryptButton
							colorStyle="rose"
							btnText="Unenroll TOTP"
							onClick={() => unenrollTOTP(factorId!)}
						/>
					</div>
				)}
			</div>
		</form>
	);
};

export default EnterCode;
