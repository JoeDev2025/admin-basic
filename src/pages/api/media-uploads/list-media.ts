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
	try {
		const { page = 1, pageSize = 50, filterBy = "standard" } = req.query;

		// Validate page and pageSize
		const pageNumber = parseInt(page as string, 10);
		const pageSizeNumber = parseInt(pageSize as string, 10);

		if (
			isNaN(pageNumber) ||
			isNaN(pageSizeNumber) ||
			pageNumber < 1 ||
			pageSizeNumber < 1
		) {
			throw new Error("Invalid pagination parameters.");
		}

		const from = (pageNumber - 1) * pageSizeNumber;
		const to = from + pageSizeNumber - 1;

		// Query media_uploads table with pagination and total count
		let query = supabaseBACKEND
			.from("media_uploads")
			.select("*", { count: "exact" }); // Get total count of items
		// .eq("user_id", req.user.id); // Base condition

		if (filterBy === "standard") {
			query = query.is("used_elsewhere", null); // Filter rows where used_elsewhere is null
		} else if (filterBy !== "all") {
			query = query.eq("used_elsewhere", filterBy); // Filter by specific string value
		}

		// Add ordering and range
		query = query.order("created_at", { ascending: false }).range(from, to);
		const { data, error, count } = await query;

		if (error) {
			throw new Error(`Failed to fetch media: ${error.message}`);
		}

		SUCCESS_API_OUTPUT(res, {
			media: data,
			total: count,
			page: pageNumber,
			pageSize: pageSizeNumber,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		ERROR_API_OUTPUT(res, errorMessage, 500);
	}
};

export default PROTECTED_API(handler, ["GET"]);
