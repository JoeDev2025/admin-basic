import { supabaseBACKEND } from "@/lib/api-utils/API-BACKEND-CLIENT";
import { NextApiResponse } from "next";
import {
	AuthenticatedRequest,
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "../../../lib/api-utils/API-MIDDLEWARE";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
	try {
		// Validate request method
		if (req.method !== "POST") {
			return ERROR_API_OUTPUT(res, "Method not allowed", 405);
		}

		const { targetUserId } = req.body;

		// Ensure request includes targetUserId
		if (!targetUserId) {
			return ERROR_API_OUTPUT(res, "Target user ID is required", 400);
		}

		// 🛡️ SECURITY CHECK: Ensure only a super_admin can promote users
		const { data: requestingUser, error: requestingUserError } =
			await supabaseBACKEND
				.from("admin_users")
				.select("admin_role")
				.eq("user_id", req.user.id)
				.single();

		if (
			requestingUserError ||
			!requestingUser ||
			requestingUser.admin_role !== "super_admin"
		) {
			return ERROR_API_OUTPUT(
				res,
				"Unauthorized. Only super_admins can promote users.",
				403
			);
		}

		// ✅ 1: Check if the target user already has user_type = "admin"
		const { data: targetUser, error: fetchUserError } =
			await supabaseBACKEND.auth.admin.getUserById(targetUserId);

		if (fetchUserError || !targetUser) {
			return ERROR_API_OUTPUT(res, "Target user not found", 404);
		}

		// If the user is already an admin, return an error
		if (targetUser.user?.app_metadata?.user_type === "admin") {
			return ERROR_API_OUTPUT(res, "User is already an admin", 400);
		}

		// ✅ 2: Update `auth.users` to set `user_type` = "admin"
		const updatedMetadata = {
			...targetUser.user.app_metadata,
			user_type: "admin",
		};

		const { error: updateError } =
			await supabaseBACKEND.auth.admin.updateUserById(targetUserId, {
				app_metadata: updatedMetadata,
			});

		if (updateError) {
			return ERROR_API_OUTPUT(res, "Failed to update user role", 500);
		}

		// Add to admin users table if not already present
		if (targetUserId !== req.user.id) {
			// ✅ 3: Insert user into `admin_users` table with default role "standard"
			const { error: insertError } = await supabaseBACKEND
				.from("admin_users")
				.insert([{ user_id: targetUserId, admin_role: "standard" }]);

			if (insertError) {
				return ERROR_API_OUTPUT(
					res,
					"Failed to insert user into admin_users",
					500
				);
			}
		}

		return SUCCESS_API_OUTPUT(res, {
			message: "User successfully promoted to admin",
		});
	} catch (err) {
		console.error(err);
		return ERROR_API_OUTPUT(res, "Internal Server Error", 500);
	}
};

export default PROTECTED_API(handler, ["POST"]);
