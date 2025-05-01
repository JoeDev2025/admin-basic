/* eslint-disable @next/next/no-img-element */
"use client";
import { bytesToHumanReadable } from "@/lib/helpers";
import {
	fetchSBAuthToken,
	supabasePUBLIC_URL,
	supabaseSTORAGE_PATH,
} from "@/lib/supabaseClient";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { TbReload } from "react-icons/tb";
import ConfirmationPopover from "../UI/ConfirmationPopover";
import { LoaderMedium, LoaderTiny } from "../UI/Loaders";

type MediaItem = {
	media_id: string;
	file_name: string;
	original_filename: string;
	storage_path: string;
	thumbnail_path: string;
	created_at: string;
	file_type: string;
	file_size: number;
	used_elsewhere: null | string;
	description: string;
};

type FilderByType = "standard" | "all" | "profile" | "blogs";
type Props = {
	newRefresh: number;
};
const MediaGallery = (props: Props) => {
	const { newRefresh } = props;
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [filterBy, setFilterBy] = useState<FilderByType>("standard");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refresh, setRefresh] = useState(false);
	const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(16); // Items per page
	const [totalResults, setTotalResults] = useState(0); // Total number of items

	const fetchMedia = async () => {
		const authToken = await fetchSBAuthToken();

		setLoading(true);
		setError(null);

		try {
			const response = await axios.get("/api/media-uploads/list-media", {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
				params: {
					page: currentPage,
					pageSize,
					filterBy,
				},
			});

			if (response.data.success) {
				setMediaItems(response.data.data.media);
				setTotalResults(response.data.data.total); // Set total results for pagination
			} else {
				setError(response.data.error);
			}
		} catch (err) {
			setError((err as Error).message || "Failed to fetch media.");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (mediaId: string) => {
		const authToken = await fetchSBAuthToken();
		setDeletingIds((prev) => new Set(prev).add(mediaId));

		try {
			const response = await axios.delete("/api/media-uploads/delete-media", {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
				data: { mediaId },
			});

			if (response.status === 200) {
				setMediaItems((prevItems) =>
					prevItems.filter((item) => item.media_id !== mediaId)
				);
			} else {
				setError(response.data.error);
			}
		} catch (err) {
			console.error("Error deleting media:", err);
			setError((err as Error).message || "Failed to delete media.");
		} finally {
			setDeletingIds((prev) => {
				const newSet = new Set(prev);
				newSet.delete(mediaId);
				return newSet;
			});
		}
	};

	useEffect(() => {
		fetchMedia();
	}, [currentPage, refresh, newRefresh]);

	// Pagination helpers
	const totalPages = Math.ceil(totalResults / pageSize);
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalResults);

	return (
		<div>
			{error && <div className="text-red-500 text-center mt-4">{error}</div>}
			<div className="flex justify-between p-4">
				<div>
					{mediaItems.length > 0 && (
						<span>
							Viewing {start}-{end} of {totalResults} items
						</span>
					)}
				</div>
				<div className="flex justify-end items-center gap-3">
					<select
						className="bg-black border border-white/30 p-1 rounded-md text-xs"
						onChange={(e) => setFilterBy(e.target.value as FilderByType)}
						value={filterBy}>
						<option value="all">Display All</option>
						<option value="standard">Manual Upload</option>
						<option value="profile">Profile</option>
						<option value="blogs">Blog</option>
						<option value="shopping">Shopping</option>
					</select>
					<button
						onClick={() => setRefresh((prev) => !prev)}
						className="bg-blue-500 text-white px-2 py-2 rounded flex justify-center items-center gap-2">
						{loading ? <LoaderTiny /> : <TbReload />}
					</button>
				</div>
			</div>
			{mediaItems.length === 0 && !loading && (
				<div className="text-center mt-10">
					No media found... please upload stuff
				</div>
			)}
			{loading && (
				<div className="mt-8">
					<LoaderMedium />
				</div>
			)}
			<div
				className={clsx(
					loading && "animate-pulse",
					"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
				)}>
				{mediaItems.map((item) => (
					<DisplayMediaItem
						key={item.media_id}
						item={item}
						isDeleting={deletingIds.has(item.media_id)}
						onDelete={handleDelete}
					/>
				))}
			</div>

			{/* Pagination Controls */}
			{mediaItems.length > 0 && (
				<div className="flex justify-between items-center p-4">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50">
						Previous
					</button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
						className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50">
						Next
					</button>
				</div>
			)}
		</div>
	);
};

const DisplayMediaItem = React.memo(
	({
		item,
		isDeleting,
		onDelete,
	}: {
		item: MediaItem;
		isDeleting: boolean;
		onDelete: (mediaId: string, storagePath: string) => void;
	}) => {
		const [description, setDescription] = useState(item.description);
		const [updating, setUpdating] = useState(false);
		const [error, setError] = useState<string | null>(null);

		const updateDescription = async () => {
			const authToken = await fetchSBAuthToken();
			if (description === item.description) return; // No change, skip update
			setUpdating(true);
			try {
				const response = await axios.put(
					"/api/media-uploads/update-media",
					{ media_id: item.media_id, description },
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);

				if (response.status !== 200 || !response.data.success) {
					setError(`Description Update Error: ${response.data.error}`);
					setDescription(item.description); // Revert to original on failure
				}
			} catch (err) {
				console.error("Error updating description:", err);
				setError(`Description Update Error: ${(err as Error).message}`);
				setDescription(item.description); // Revert to original on failure
			} finally {
				setUpdating(false);
			}
		};

		return (
			<div
				className={clsx(
					isDeleting && "opacity-50",
					"relative rounded overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 group"
				)}>
				{item.file_type.startsWith("video/") ? (
					<video
						controls={true}
						autoPlay={false}
						muted={true}
						poster={`${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${item.thumbnail_path}`}
						className="w-full h-48 object-cover">
						<source
							src={`${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${item.storage_path}`}
							type={item.file_type}
						/>
						Your browser does not support the video tag.
					</video>
				) : (
					<img
						src={`${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${item.thumbnail_path}`}
						alt={item.file_name}
						className="w-full h-48 object-cover"
					/>
				)}
				<div className="p-2 text-sm">
					<a
						className="font-medium truncate group-hover:underline"
						href={`${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${item.storage_path}`}
						target="_blank"
						rel="noopener noreferrer">
						{item.file_name}
					</a>
					<p className="text-gray-500 text-xs">
						Added: {new Date(item.created_at).toLocaleString()}
					</p>
					<p className="text-gray-500 text-xs">
						Orig: {item.original_filename}
					</p>
					{/* bytesToHumanReadable */}
					<p className="text-gray-500 text-xs">
						Size: {bytesToHumanReadable(item.file_size)}
					</p>
					<div className="flex items-center relative">
						<input
							type="text"
							className="w-full mt-2 p-1 text-xs bg-black/30"
							placeholder="Alt/Description"
							value={description || ""}
							onChange={(e) => setDescription(e.target.value)}
							onBlur={updateDescription}
							disabled={updating}
						/>
						{error && <p className="text-red-500 text-xs">{error}</p>}
						{updating && (
							<div className="absolute top-3 right-0">
								<LoaderTiny />
							</div>
						)}
					</div>
				</div>

				{/* Delete Button */}
				<div className="absolute top-2 right-2">
					<ConfirmationPopover
						onConfirm={() => {
							onDelete(item.media_id, item.storage_path);
						}}
						onCancel={() => {
							console.log("Delete canceled");
						}}
						isProcessing={isDeleting}>
						{/* <p className="text-xs">Confirm delete?</p> */}
					</ConfirmationPopover>
				</div>
				{item.used_elsewhere && (
					<div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
						Used in: <b className="capitalize">{item.used_elsewhere}</b>
					</div>
				)}
			</div>
		);
	},
	(prevProps, nextProps) =>
		prevProps.item.media_id === nextProps.item.media_id &&
		prevProps.isDeleting === nextProps.isDeleting
);

DisplayMediaItem.displayName = "DisplayMediaItem";

export default MediaGallery;
