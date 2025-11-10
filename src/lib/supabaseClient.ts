import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project credentials
export const supabasePUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseCLIENT = createClient(
	supabasePUBLIC_URL,
	supabaseANON_KEY
);

export const supabaseSTORAGE_PATH = "/storage/v1/object/public/"; // This is generally the same, but left it here in case it changes

const authTokenKey =
	`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}-auth-token` ||
	"invalid-project-ref";

// Automatically handle token refresh and sync with localStorage
if (typeof window !== "undefined") {
	supabaseCLIENT.auth.onAuthStateChange((event, session) => {
		if (session) {
			// Update the token in localStorage when a new session is set
			localStorage.setItem(authTokenKey, JSON.stringify(session));
		} else if (event === "SIGNED_OUT") {
			// Clear token from localStorage on sign out
			localStorage.removeItem(authTokenKey);
		}
	});
}

export const fetchSBAuthToken = async (): Promise<string | null> => {
	if (typeof window === "undefined") return null;

	const storedToken = localStorage.getItem(authTokenKey);
	if (!storedToken) return null;

	const parsedToken = JSON.parse(storedToken);
	const { access_token, expires_at } = parsedToken;

	// Check if token is close to expiring (e.g., within 60 seconds)
	if (expires_at && Date.now() / 1000 > expires_at - 60) {
		console.log("Refreshing token...");
		const {
			data: { session },
			error,
		} = await supabaseCLIENT.auth.refreshSession();

		if (error) {
			console.error("Failed to refresh token:", error.message);
			return null;
		}

		if (session) {
			localStorage.setItem(authTokenKey, JSON.stringify(session));
			return session.access_token;
		}
	}

	return access_token;
};
