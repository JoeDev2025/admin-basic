"use client";
import { fetchSBAuthToken, supabaseCLIENT } from "@/lib/supabaseClient";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { FaTimes, FaTrash, FaUpload, FaUser } from "react-icons/fa";
import { useAuthModal } from "../UI/Auth/AuthModlProvider";
import { LoaderTiny } from "../UI/Loaders";

export default function ProfileUsersImage() {
	const [userProfileImageURL, setUserProfileImageURL] = useState("");
	const [userProfileImageThumbnailURL, setUserProfileImageThumbnailURL] =
		useState("");
	const [imageUploadProgress, setImageUploadProgress] = useState(0);
	const [showEditing, setShowEditing] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const { authState, refreshAuthState } = useAuthModal();
	const { user, adminData } = authState;
	const { profile_image_url, profile_image_thumbnail_url } = adminData || {};

	useEffect(() => {
		if (profile_image_url && profile_image_thumbnail_url) {
			setUserProfileImageURL(profile_image_url);
			setUserProfileImageThumbnailURL(profile_image_thumbnail_url);
		}
	}, [profile_image_url, profile_image_thumbnail_url]);

	// Upload Profile Image File
	const uploadProfileImageFile = async (
		file: File
	): Promise<{
		success: boolean;
		data: { url: string; thumbnail_url: string };
	}> => {
		const authToken = await fetchSBAuthToken();
		setImageUploadProgress(1);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("convertImagesToWebp", "true"); // Pass as a string to force all images to be converted to WebP
			formData.append("limitMaxWidthHeight", "512"); // Pass as a string to limit max width/height to 512px
			formData.append("limitThumbnailMaxWidthHeight", "128"); // Pass as a string to limit thumbnail max width/height to 128px
			formData.append("used_elsewhere", "profile"); // Mark the file as used elsewhere

			const response = await axios.post(
				"/api/media-uploads/upload-media",
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							progressEvent.total
								? (progressEvent.loaded * 100) / progressEvent.total
								: 0
						);
						// Cap the progress at 95%
						setImageUploadProgress(Math.min(progress, 95));
					},
				}
			);
			setImageUploadProgress(100);
			// Return the uploaded file URL from the API response
			return response.data; // Ensure your API returns the uploaded file URL
		} catch (error) {
			console.error("Error uploading file:", error);
			setError("Error uploading file");
			return { success: false, data: { url: "", thumbnail_url: "" } };
		}
	};

	// Handle Profile Image Change
	const handleProfileImageChange = async (
		url: string,
		thumbnail_url: string
	) => {
		setError(null);
		if (!user || !user.id) {
			setError("User not authenticated.");
			return;
		}
		// Update
		const { error } = await supabaseCLIENT
			.from("user_admin_view")
			.update({
				profile_image_url: url,
				profile_image_thumbnail_url: thumbnail_url,
			})
			.eq("user_id", user.id);

		if (error) setError(error.message);
		refreshAuthState();
		setImageUploadProgress(0);
		setShowEditing(false);
	};

	// Clear Profile Image
	const handleClearProfileImage = async () => {
		const confirmer = confirm(
			"Are you sure you want to remove your profile image?"
		);
		if (!confirmer) return;
		setError(null);
		if (!user || !user.id) {
			setError("User not authenticated.");
			return;
		}
		// Update
		const { error } = await supabaseCLIENT
			.from("user_admin_view")
			.update({ profile_image_url: null, profile_image_thumbnail_url: null })
			.eq("user_id", user.id);

		if (error) setError(error.message);

		refreshAuthState();
		setUserProfileImageURL("");
		setUserProfileImageThumbnailURL("");
		setShowEditing(false);
	};

	return (
		<div>
			<div className="flex items-center justify-center gap-3 relative">
				<div className=" relative group rounded-full">
					{userProfileImageThumbnailURL ? (
						<>
							<div className="w-16 h-16 rounded-full group relative bg-black/90">
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
									<LoaderTiny />
								</div>
								{/* Small Thumb */}
								<img
									src={userProfileImageThumbnailURL}
									alt="Profile"
									className="w-16 h-16 rounded-full object-cover relative z-10"
								/>
								{/* Large Thumb for hover over */}
								<div className="w-64 h-64 absolute top-8 right-8 md:right-auto md:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 rounded-xl overflow-hidden">
									<img
										src={userProfileImageURL}
										alt="Profile"
										className="w-64 h-64 object-contain rounded-xl"
									/>
								</div>
							</div>
						</>
					) : (
						<div className="w-16 h-16 rounded-full bg-gray-500 flex justify-center items-center text-4xl">
							<FaUser />
						</div>
					)}
					<div className="hidden group-hover:flex absolute w-full h-full bg-black/70 justify-center-center top-0 z-20 rounded-full">
						<button
							onClick={() => setShowEditing((prev) => !prev)}
							className="w-full text-center text-sm">
							Edit
						</button>
					</div>
				</div>

				{/* File input to upload image */}
				{showEditing && (
					<div className="mt-2 absolute right-0 md:right-auto bottom-16 w-56 bg-black border border-white/20 rounded-md py-4 px-6">
						{/* X close */}
						<button
							onClick={() => setShowEditing(false)}
							className="absolute top-1 right-1 text-xs text-white opacity-50 hover:opacity-100">
							<FaTimes />
						</button>
						<label
							className={clsx(
								imageUploadProgress !== 0
									? "animate-pulse cursor-progress"
									: " cursor-pointer",
								"text-xs text-sky-500"
							)}>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (file) {
										const result = await uploadProfileImageFile(file);
										if (result.success) {
											const { url, thumbnail_url } = result.data;
											handleProfileImageChange(url, thumbnail_url);
											setUserProfileImageURL(thumbnail_url);
										}
									}
								}}
							/>

							<div className="flex flex-col">
								{/* Progress bar */}
								{imageUploadProgress > 0 ? (
									<div className="flex items-center gap-1">
										<LoaderTiny />
										<div className="flex w-44 h-2 bg-sky-900/30 rounded-lg">
											<div
												className="h-full bg-emerald-500 rounded-lg transition-transform duration-500 ease-in-out"
												style={{
													width: `${imageUploadProgress}%`,
												}}></div>
										</div>
									</div>
								) : (
									<div className="flex gap-1 w-full justify-center items-center hover:underline text-sm">
										<FaUpload className="text-xs" />
										<span>
											{userProfileImageThumbnailURL
												? "Replace Image"
												: "Choose file"}
										</span>
									</div>
								)}
							</div>
						</label>
						{/* Button to dleete profile image */}
						{userProfileImageThumbnailURL && (
							<div className="flex justify-center">
								<button
									className="text-xs text-red-800/50 hover:text-red-700 mt-2 flex gap-1 items-center"
									onClick={handleClearProfileImage}>
									<FaTrash />
									<span>Remove current</span>
								</button>
							</div>
						)}
					</div>
				)}

				{error && (
					<div className="flex items-center gap-2 mt-2 text-red-500">
						<CiWarning />
						<span>{error}</span>
					</div>
				)}
			</div>
		</div>
	);
}
