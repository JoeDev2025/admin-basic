import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseBACKEND } from "../../../lib/api-utils/API-BACKEND-CLIENT";
import {
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "../../../lib/api-utils/API-MIDDLEWARE";

const handler = async (
	req: NextApiRequest & { user: { id: string } },
	res: NextApiResponse
) => {
	if (req.method !== "PUT") {
		return ERROR_API_OUTPUT(res, "Method not allowed", 405);
	}

	try {
		const { media_id, description } = req.body;

		if (!media_id) {
			throw new Error("Missing media ID in request body");
		}

		// Ensure at least one column is provided for update
		if (!description || description.trim().length === 0) {
			throw new Error("Missing description in request body");
		}

		const { data, error } = await supabaseBACKEND
			.from("media_uploads")
			.update({ description })
			.eq("media_id", media_id)
			.eq("user_id", req.user.id)
			.select();

		if (error) {
			throw new Error(`Failed to update media: ${error.message}`);
		}

		if (!data || data.length === 0) {
			throw new Error("Media not found or not authorized to update");
		}

		SUCCESS_API_OUTPUT(res, { updatedMedia: data[0] });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		ERROR_API_OUTPUT(res, errorMessage, 500);
	}
};

export default PROTECTED_API(handler, ["PUT"]);
