import { supabaseBACKEND } from "@/lib/api-utils/API-BACKEND-CLIENT";
import { NextApiResponse } from "next";
import {
	AuthenticatedRequest,
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "../../../lib/api-utils/API-MIDDLEWARE";

const resultsPerPage = 10; // Number of users per page

const handler = async (
	req: AuthenticatedRequest,
	res: NextApiResponse
): Promise<void> => {
	try {
		// Extract query params for filtering and pagination
		const { userType, page = "1" } = req.query;
		const pageNumber = parseInt(page as string, 10);

		if (isNaN(pageNumber) || pageNumber < 1) {
			return ERROR_API_OUTPUT(res, "Invalid page parameter", 400);
		}

		if (!userType || (userType !== "admin" && userType !== "customer")) {
			return ERROR_API_OUTPUT(res, "Invalid userType parameter", 400);
		}

		// Fetch all users from Supabase Auth
		const { data, error: authError } =
			await supabaseBACKEND.auth.admin.listUsers();

		if (authError) {
			console.error(authError);
			return ERROR_API_OUTPUT(res, "Failed to fetch users", 500);
		}

		// Filter users based on user_type in raw_app_meta_data
		const filteredUsers = (data.users || []).filter((user) => {
			const userTypeFromMeta = user.app_metadata?.user_type;
			return userType === "admin"
				? userTypeFromMeta === "admin" // Explicitly marked as admin
				: userTypeFromMeta !== "admin"; // Implicit customers (not admin)
		});

		// Total users matching the filter
		const totalUsers = filteredUsers.length;
		const lastPage = Math.ceil(totalUsers / resultsPerPage);

		// Paginate the filtered users
		const paginatedUsers = filteredUsers.slice(
			(pageNumber - 1) * resultsPerPage,
			pageNumber * resultsPerPage
		);

		// Extract user IDs for further filtering
		const userIds = paginatedUsers.map((user) => user.id);

		if (userIds.length === 0) {
			return SUCCESS_API_OUTPUT(res, {
				users: [],
				total: totalUsers,
				lastPage,
			});
		}

		// Fetch admin_users data only if userType is "admin"
		let adminUsers: {
			user_id: string;
			admin_role: string;
			profile_image_url: string;
			profile_image_thumbnail_url: string;
			author_summary: string;
		}[] = [];

		if (userType === "admin") {
			const { data: adminData, error: adminError } = await supabaseBACKEND
				.from("admin_users")
				.select(
					"user_id, admin_role, profile_image_url, profile_image_thumbnail_url, author_summary"
				)
				.in("user_id", userIds);

			if (adminError) {
				console.error(adminError);
				return ERROR_API_OUTPUT(res, "Failed to fetch admin user data", 500);
			}
			adminUsers = adminData || [];
		}

		// Merge auth.users data with admin_users (only if user is an admin)
		const mergedData = paginatedUsers.map((user) => ({
			...user,
			is_verified: !!user.email_confirmed_at, // ✅ Add Verification Status
			admin_data:
				userType === "admin"
					? adminUsers.find((admin) => admin.user_id === user.id) || null
					: undefined, // Don't include admin_data for customers
		}));

		// Return paginated results along with total count and last page number
		return SUCCESS_API_OUTPUT(res, {
			users: mergedData,
			total: totalUsers,
			lastPage,
		});
	} catch (err) {
		console.error(err);
		return ERROR_API_OUTPUT(res, "Internal Server Error", 500);
	}
};

export default PROTECTED_API(handler, ["GET"]);
