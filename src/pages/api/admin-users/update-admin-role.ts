import { supabaseBACKEND } from "@/lib/api-utils/API-BACKEND-CLIENT";
import {
	AuthenticatedRequest,
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "@/lib/api-utils/API-MIDDLEWARE";
import { NextApiResponse } from "next";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return ERROR_API_OUTPUT(res, "Method not allowed", 405);
	}

	try {
		const { targetUserId, newRole } = req.body;
		const allowedRoles = ["standard", "admin", "super_admin"];

		// ✅ **Step 1: Validate new admin role**
		if (!allowedRoles.includes(newRole)) {
			return ERROR_API_OUTPUT(res, "Invalid admin role", 400);
		}

		// ✅ **Step 2: Extract and validate the requesting user's token**
		const authToken = req.headers.authorization?.replace("Bearer ", "");

		if (!authToken) {
			return ERROR_API_OUTPUT(res, "Missing authentication token", 401);
		}

		// 🔍 Verify the user in **real-time** using Supabase Auth API
		const { data: authUser, error: authError } = await supabaseBACKEND.auth.getUser(authToken);

		if (!authUser || authError) {
			return ERROR_API_OUTPUT(res, "Unauthorized - Invalid token", 403);
		}

		// ✅ **Step 3: Ensure the authenticated user is a real `super_admin`**
		const requestingUserId = authUser.user.id;

		// 🔍 Check the user's `user_type` in `auth.users`
		if (authUser.user.app_metadata?.user_type !== "admin") {
			return ERROR_API_OUTPUT(res, "Unauthorized - You are Not an admin", 403);
		}

		// 🔍 Lookup `admin_role` in `admin_users`
		const { data: adminUser, error: adminError } = await supabaseBACKEND
			.from("admin_users")
			.select("admin_role")
			.eq("user_id", requestingUserId)
			.single();

		if (!adminUser || adminError || adminUser.admin_role !== "super_admin") {
			return ERROR_API_OUTPUT(res, "Unauthorized - You are Not a super_admin", 403);
		}

		// ✅ **Step 4: Verify the target user exists in `auth.users`**
		const { data: targetUser, error: targetUserError } = await supabaseBACKEND
			.auth.admin.getUserById(targetUserId);

		if (!targetUser || targetUserError) {
			return ERROR_API_OUTPUT(res, "Target user not found", 404);
		}

		// ✅ **Step 5: Ensure the target user is an admin before updating**
		const { data: targetAdmin, error: targetAdminError } = await supabaseBACKEND
			.from("admin_users")
			.select("user_id")
			.eq("user_id", targetUserId)
			.single();

		if (!targetAdmin || targetAdminError) {
			return ERROR_API_OUTPUT(res, "Target user is not an admin", 400);
		}

		// 🔄 **Step 6: Update admin role**
		const { error: updateError } = await supabaseBACKEND
			.from("admin_users")
			.update({ admin_role: newRole })
			.eq("user_id", targetUserId);

		if (updateError) {
			console.error(updateError);
			return ERROR_API_OUTPUT(res, "Failed to update admin role", 500);
		}

		return SUCCESS_API_OUTPUT(res, { message: "Admin role updated successfully" });
	} catch (err) {
		console.error(err);
		return ERROR_API_OUTPUT(res, "Internal Server Error", 500);
	}
};

export default PROTECTED_API(handler, ["POST"]);
