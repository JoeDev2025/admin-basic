"use client";

import { supabaseCLIENT } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { AuthFormType } from "./AuthModal";
import AuthModalLoader from "./AuthModalLoader"; // Import the lazy-loaded modal

export type AuthState =
	| {
			pending: true;
			loggedIn: false;
			loggedOut: false;
			user: null;
			adminData: null;
	  }
	| {
			pending: false;
			loggedIn: true;
			loggedOut: false;
			user: User;
			adminData: {
				admin_role: string | null;
				profile_image_url: string | null;
				profile_image_thumbnail_url: string | null;
				author_summary: string | null;
			};
	  }
	| {
			pending: false;
			loggedIn: false;
			loggedOut: true;
			user: null;
			adminData: null;
	  };

// Context for controlling the AuthModal
const ModalContext = createContext<{
	openAuthModal: (type: AuthFormType) => void;
	closeAuthModal: () => void;
	authState: AuthState;
	refreshAuthState: () => void;
}>({
	openAuthModal: () => {},
	closeAuthModal: () => {},
	authState: {
		pending: true,
		loggedIn: false,
		loggedOut: false,
		user: null,
		adminData: null,
	},
	refreshAuthState: () => {},
});

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [authType, setAuthType] = useState<AuthFormType>("signin");
	const [authState, setAuthState] = useState<AuthState>({
		pending: true,
		loggedIn: false,
		loggedOut: false,
		user: null,
		adminData: null,
	});

	const openAuthModal = useCallback((type: AuthFormType) => {
		setAuthType(type);
		setIsOpen(true);
	}, []);

	const closeAuthModal = useCallback(() => setIsOpen(false), []);

	const refreshAuthState = async () => {
		try {
			await supabaseCLIENT.auth.refreshSession();
			const { data, error } = await supabaseCLIENT.auth.getSession();
			if (error) {
				throw error;
			}
			if (data.session) {
				const user = data.session.user;

				// Fetch admin data from the admin_users table
				const { data: adminData, error: adminError } = await supabaseCLIENT
					.from("user_admin_view")
					.select(
						"admin_role, profile_image_url, profile_image_thumbnail_url, author_summary"
					)
					.eq("user_id", user.id)
					.single();

					console.log("adminData", adminData);

				if (adminError) {
					console.error("Error fetching admin user data:", adminError.message);
					setAuthState({
						pending: false,
						loggedIn: true,
						loggedOut: false,
						user,
						adminData: {
							admin_role: "standard",
							profile_image_url: null,
							profile_image_thumbnail_url: null,
							author_summary: null,
						}, // No admin data found
					});
				} else {
					setAuthState({
						pending: false,
						loggedIn: true,
						loggedOut: false,
						user,
						adminData: {
							admin_role: adminData?.admin_role || "standard",
							profile_image_url: adminData?.profile_image_url || null,
							profile_image_thumbnail_url:
								adminData?.profile_image_thumbnail_url || null,
							author_summary: adminData?.author_summary || null,
						},
					});
				}
			} else {
				throw new Error("No session data");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Error getting session:", error.message);
			} else {
				console.error("Error getting session:", error);
			}
			setAuthState({
				pending: false,
				loggedIn: false,
				loggedOut: true,
				user: null,
				adminData: null,
			});
		}
	};

	useEffect(() => {
		refreshAuthState();
	}, []);

	return (
		<ModalContext.Provider
			value={{ openAuthModal, closeAuthModal, authState, refreshAuthState }}>
			{children}
			<AuthModalLoader isOpen={isOpen} setIsOpen={setIsOpen} type={authType} />
		</ModalContext.Provider>
	);
};

// Hook to access modal control
export const useAuthModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};
