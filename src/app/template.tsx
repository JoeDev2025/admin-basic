"use client";

import { AuthModalProvider } from "@/components/UI/Auth/AuthModlProvider";

export default function Template({ children }: { children: React.ReactNode }) {
	return <AuthModalProvider>{children}</AuthModalProvider>;
}
