/**
 * Sample API endpoint using the API-MIDDLEWARE
 */
import {
	AuthenticatedRequest,
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "@/lib/api-utils/API-MIDDLEWARE";
import { NextApiResponse } from "next";
const handler = async (
	req: AuthenticatedRequest,
	res: NextApiResponse
): Promise<void> => {
	try {
		// Sample do something with API
		const data = [
			{ title: "Article 1", content: "This is article 1" },
			{ title: "Article 2", content: "This is article 2" },
		];
		// User can invoke fake error using query param for the purposes of this demo!
		const { error } = req.query;
		if (error) {
			return ERROR_API_OUTPUT(res, "Fake error invoked by query param", 500);
		}
		return SUCCESS_API_OUTPUT(res, data);
	} catch (err) {
		console.error(err);
		return ERROR_API_OUTPUT(res, "Internal Server Error", 500);
	}
};
// PROTECTED_API wrapper forces user to send over a valid JWT supabase auth token
export default PROTECTED_API(handler, ["GET"]);
