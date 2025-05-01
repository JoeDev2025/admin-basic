"use client";

import { FC, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import { GleamButton } from "../Buttons/GleamButton";
import { LoaderExtraLarge } from "../Loaders";
import { AuthFormType } from "./AuthModal";
import { useAuthModal } from "./AuthModlProvider";

type ShowMustLoginProps = {
	openAuthModal: (type: AuthFormType) => void;
};
const ShowMustLogin = (props: ShowMustLoginProps) => {
	const { openAuthModal } = props;
	return (
		<div className="flex justify-center items-center pt-64">
			<div className="text-center">
				<p className="text-lg mt-4">Please sign in to continue</p>
				<div className="flex justify-center mt-6">
					<GleamButton
						onClick={() => openAuthModal("signin")}
						icon={<FiLogIn />}>
						Sign In
					</GleamButton>
				</div>
			</div>
		</div>
	);
};

type PageNotProtectedProps = {
	children: React.ReactNode;
};

export const PageProtected: FC<PageNotProtectedProps> = ({ children }) => {
	const { authState, openAuthModal } = useAuthModal();

	useEffect(() => {
		if (authState.loggedOut) {
			openAuthModal("signin");
		}
	}, [authState.loggedOut, openAuthModal]);

	if (authState.pending) {
		// Make a loading spinner here
		return (
			<div className="my-64">
				<LoaderExtraLarge />
			</div>
		);
	}

	if (authState.loggedOut) {
		// Ask user to sign in
		return <ShowMustLogin openAuthModal={openAuthModal} />;
	}

	if (authState.loggedIn) {
		return <>{children}</>;
	}
};

// Now lets create a ComponentProtected component that will be used to protect a component,
// It can accept either signedInChildren or loggedOutChildren as props and display either of them based on the auth state
type ComponentProtectedProps = {
	signedInChildren: React.ReactNode;
	loggedOutChildren: React.ReactNode;
};
export const ComponentProtected = (props: ComponentProtectedProps) => {
	const { signedInChildren, loggedOutChildren } = props;
	const { authState } = useAuthModal();

	if (authState.loggedIn) {
		return <>{signedInChildren}</>;
	}

	if (authState.loggedOut) {
		return <>{loggedOutChildren}</>;
	}

	return null;
};
