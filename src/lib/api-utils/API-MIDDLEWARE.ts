// src/pages/api/api-utils/API-PROTECTED.ts

import { createClient, User } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export type AuthenticatedRequest = NextApiRequest & { user: User };

type Handler = (
	req: AuthenticatedRequest,
	res: NextApiResponse
) => Promise<void>;

const supabaseBACKEND = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const SUCCESS_API_OUTPUT = <T>(
	res: NextApiResponse,
	data: T,
	status: number = 200
): void => {
	res.status(status).json({ success: true, data });
};

export const ERROR_API_OUTPUT = (
	res: NextApiResponse,
	message: string,
	status: number = 500
): void => {
	res.status(status).json({ success: false, error: message });
};

const isAuthenticated = async (req: NextApiRequest): Promise<User | null> => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return null;
	}

	const accessToken = authHeader.split(" ")[1];
	if (!accessToken) {
		return null;
	}

	const { data, error: authError } = await supabaseBACKEND.auth.getUser(
		accessToken
	);
	const user = data.user;

	if (authError || !user) {
		console.error("Authentication error:", authError?.message);
		return null;
	}

	return user;
};

export const PROTECTED_API =
	(handler: Handler, allowedMethods: string[] = ["GET"]) =>
	async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		if (!allowedMethods.includes(req.method || "")) {
			res.setHeader("Allow", allowedMethods.join(", "));
			return ERROR_API_OUTPUT(res, "Method Not Allowed", 405);
		}

		const user = await isAuthenticated(req);

		if (!user) {
			return ERROR_API_OUTPUT(res, "Unauthorized", 401);
		}

		// Pass the authenticated user to the handler
		(req as AuthenticatedRequest).user = user;

		try {
			await handler(req as AuthenticatedRequest, res);
		} catch (error) {
			ERROR_API_OUTPUT(
				res,
				(error as Error).message || "Internal Server Error",
				500
			);
		}
	};

export const PUBLIC_AND_OPEN_API =
	(
		handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
		allowedMethods: string[] = ["GET"]
	) =>
	async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		if (!allowedMethods.includes(req.method || "")) {
			res.setHeader("Allow", allowedMethods.join(", "));
			return ERROR_API_OUTPUT(res, "Method Not Allowed", 405);
		}

		try {
			await handler(req, res);
		} catch (error) {
			ERROR_API_OUTPUT(
				res,
				(error as Error).message || "Internal Server Error",
				500
			);
		}
	};
