import { fetchSBAuthToken } from "@/lib/supabaseClient";
import axios from "axios";
import clsx from "clsx";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { VscUnverified } from "react-icons/vsc";
import ConfirmationPopover from "../UI/ConfirmationPopover";
import { LoaderMedium } from "../UI/Loaders";
import { UsersPagination } from "./UsersPagination";

interface User {
	id: string;
	email: string;
	role: string;
	email_confirmed_at: string | null;
	last_sign_in_at: string | null;
	created_at: string;
	is_verified: boolean;
	user_metadata: {
		displayName?: string;
		full_name?: string;
	};
	// This is from the secondary table "admin_users"
	admin_data: {
		admin_role: "standard" | "admin" | "super_admin";
		profile_image_url?: string;
		profile_image_thumbnail_url?: string;
		author_summary?: string;
	} | null;
}

type UserTableProps = {
	userType: "admin" | "customer";
};

const UserTable = (props: UserTableProps) => {
	const { userType } = props;
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [updateRoleError, setUpdateRoleError] = useState<string | null>(null);
	const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

	const [promotingUser, setPromotingUser] = useState<string | null>(null);
	const [promoteError, setPromoteError] = useState<string | null>(null);

	const [currentPage, setCurrentPage] = useState(1); // Track current page
	const [lastPage, setLastPage] = useState(1); // Track the last page
	const [totalItems, setTotalItems] = useState(0); // Total number of users

	const fetchUsers = async (page = 1) => {
		const authToken = await fetchSBAuthToken();
		setLoading(true);
		setError(null);

		try {
			const { data } = await axios.get(
				`/api/admin-users/list-users?userType=${userType}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);
			if (data.success) {
				setUsers(data.data.users);
				setCurrentPage(page);
				setLastPage(data.data.lastPage);
				setTotalItems(data.data.total);
			} else {
				setError("Failed to fetch users.");
			}
		} catch (err: unknown) {
			console.error(err);
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data?.error || "Failed to fetch users.");
			} else {
				setError("Failed to fetch users.");
			}
		} finally {
			setLoading(false);
		}
	};

	// Function to handle admin role updates
	const handleRoleChange = async (userId: string, newRole: string) => {
		setRoleUpdating(userId); // Show loader for the changing role
		setUpdateRoleError(null); // Clear any previous errors

		const authToken = await fetchSBAuthToken();
		try {
			const response = await axios.post(
				"/api/admin-users/update-admin-role",
				{ targetUserId: userId, newRole },
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);

			// Check if API response indicates success
			if (response.data.success) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId
							? {
									...user,
									admin_data: {
										...user.admin_data,
										admin_role: newRole as "standard" | "admin" | "super_admin",
									},
							  }
							: user
					)
				);
			} else {
				setUpdateRoleError(response.data.error || "Failed to update role.");
			}
		} catch (err) {
			console.error("Error updating role:", err);

			// Handle errors properly
			if (axios.isAxiosError(err)) {
				if (err.response) {
					// The request was made and the server responded with a non-2xx status
					setUpdateRoleError(
						err.response.data?.error || "Failed to update role."
					);
				} else if (err.request) {
					// The request was made but no response was received
					setUpdateRoleError("No response from the server.");
				} else {
					// Something happened in setting up the request
					setUpdateRoleError("Request failed.");
				}
			} else {
				setUpdateRoleError("Unexpected error occurred.");
			}
		} finally {
			setRoleUpdating(null); // Hide loader
		}
	};

	const handlePromoteCustomer = async (userId: string) => {
		setPromotingUser(userId);
		setPromoteError(null); // Clear previous errors

		const authToken = await fetchSBAuthToken();

		try {
			const response = await axios.post(
				"/api/admin-users/promote-customer-to-admin",
				{ targetUserId: userId },
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);

			if (response.data.success) {
				// Update user list: convert customer into admin with default role
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId
							? {
									...user,
									admin_data: { admin_role: "standard" }, // Default role for new admin
							  }
							: user
					)
				);
			} else {
				setPromoteError(response.data.error || "Failed to promote user.");
			}
		} catch (err) {
			console.error("Error promoting user:", err);

			if (axios.isAxiosError(err)) {
				setPromoteError(err.response?.data?.error || "Failed to promote user.");
			} else {
				setPromoteError("Unexpected error occurred.");
			}
		} finally {
			setPromotingUser(null);
		}
	};

	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 capitalize">{userType} Users</h1>
			{loading && (
				<div className="flex justify-center my-16">
					<LoaderMedium />
				</div>
			)}
			{error && <p className="text-red-500">Error: {error}</p>}
			{updateRoleError && (
				<p className="text-red-500">Update Role Error: {updateRoleError}</p>
			)}
			{promoteError && (
				<p className="text-red-500">Promotion Error: {promoteError}</p>
			)}

			{users.length > 0 ? (
				<>
					<table className="min-w-full bg-white dark:bg-black shadow-md rounded-md overflow-hidden text-xs">
						<thead className="bg-gray-100 dark:bg-zinc-900 border-b">
							<tr>
								<th className="text-left p-4 font-medium">Image</th>
								<th className="text-left p-4 font-medium">Email</th>
								<th className="text-left p-4 font-medium">Full Name</th>
								<th className="text-left p-4 font-medium">Created At</th>
								<th className="text-left p-4 font-medium">Last Sign-In</th>
								{userType === "admin" && (
									<th className="text-left p-4 font-medium">Admin Role</th>
								)}
								{userType === "customer" && (
									<th className="text-left p-4 font-medium">Promote</th>
								)}
							</tr>
						</thead>
						<tbody>
							{users.map((user) => {
								const meta_data = user.user_metadata;
								const admin_data = user.admin_data;
								return (
									<tr
										key={user.id}
										className="border-b hover:bg-gray-50 dark:hover:bg-zinc-900">
										<td className="p-4">
											{admin_data && admin_data.profile_image_thumbnail_url ? (
												<img
													src={admin_data.profile_image_thumbnail_url}
													alt={`${meta_data.full_name || "User"}'s profile`}
													className="w-8 h-8 rounded-full"
													title={admin_data.author_summary || ""}
												/>
											) : (
												<div className="w-8 h-8 rounded-full bg-zinc-700 flex justify-center items-center">
													<FaUser className="text-white w-4 h-4" />
												</div>
											)}
										</td>
										<td className="p-4">
											<div
												className={clsx(
													"flex gap-2 items-center",
													user.is_verified ? "text-white" : "text-gray-500"
												)}
												title={user.is_verified ? "Verified" : "Not Verified"}>
												{user.email}
												{user.is_verified ? (
													<FaCircleCheck className="text-green-500 text-lg" />
												) : (
													<VscUnverified className="text-red-500 text-2xl" />
												)}
											</div>
										</td>
										<td className="p-4">{meta_data.full_name || "N/A"}</td>
										<td className="p-4">{moment(user.created_at).fromNow()}</td>
										<td className="p-4">
											{user.last_sign_in_at
												? moment(user.last_sign_in_at).fromNow()
												: "Never"}
										</td>
										{/* Role Dropdown - Only for Admins */}
										{userType === "admin" && (
											<td className="p-4">
												{roleUpdating === user.id ? (
													<LoaderMedium />
												) : (
													<select
														className="border rounded p-1 bg-transparent dark:bg-sky-800"
														value={admin_data?.admin_role || "standard"}
														onChange={(e) =>
															handleRoleChange(user.id, e.target.value)
														}>
														<option value="standard">Standard</option>
														<option value="admin">Admin</option>
														<option value="super_admin">Super Admin</option>
													</select>
												)}
											</td>
										)}
										{userType === "customer" && (
											<td className="p-4">
												{promotingUser === user.id ? (
													<LoaderMedium />
												) : (
													<ConfirmationPopover
														onConfirm={() => handlePromoteCustomer(user.id)}
														onCancel={() => console.log("Promotion canceled")}
														isProcessing={promotingUser === user.id}
														type="custom"
														customText="Promote to Admin">
														<p className="text-xs">
															This cannot be undone? Are you sure?
														</p>
													</ConfirmationPopover>
												)}
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
					<UsersPagination
						currentPage={currentPage}
						lastPage={lastPage}
						totalItems={totalItems}
						onPageChange={(page) => fetchUsers(page)}
					/>
				</>
			) : (
				<p className="text-center italic animate-pulse my-16">
					--- No users found ---
				</p>
			)}
		</div>
	);
};

export default UserTable;
