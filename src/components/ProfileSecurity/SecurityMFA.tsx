import { BiQrScan } from "react-icons/bi";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";

import { GleamButton } from "../UI/Buttons/GleamButton";

export default function SecurityMFA() {
	const { openAuthModal } = useAuthModal();
	return (
		<div>
			<label className="mb-3 block text-sm font-medium ">
				Add MFA{" "}
				<span className="text-xs text-yellow-400 ml-3">
					(Required for extra account protection)
				</span>
			</label>
			<div className="flex justify-center">
				<GleamButton
					colorStyle="green"
					onClick={() => openAuthModal("entercode")}
					icon={<BiQrScan />}>
					Setup MFA Code
				</GleamButton>
			</div>
		</div>
	);
}
