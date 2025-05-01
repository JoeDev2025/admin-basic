"use client";
import { fetchSBAuthToken } from "@/lib/supabaseClient";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiCog } from "react-icons/bi";
import { LoaderSmall } from "../UI/Loaders";
import { convertToJPG } from "./helpers";

type FileState = {
	file: File;
	state: "PENDING" | "UPLOADING" | "PROCESSING" | "COMPLETED";
	progress: number;
};

type MediaUploaderProps = {
	setNewRefresh: React.Dispatch<React.SetStateAction<number>>;
};

const MediaUploader = (props: MediaUploaderProps) => {
	const { setNewRefresh } = props;
	axios.defaults.withCredentials = true;
	axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

	// const [error, setError] = useState<string | null>(null);
	const [fileStates, setFileStates] = useState<FileState[]>([]);
	const [failedUploads, setFailedUploads] = useState<File[]>([]);
	const [totalProgress, setTotalProgress] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [convertImagesToWebp, setConvertImagesToWebp] = useState(true);
	const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
	const [limitMaxWidthHeight, setLimitMaxWidthHeight] = useState<null | number>(
		2048
	);

	const maxFileSize = 50 * 1024 * 1024; // 50MB

	const handleIncrement = () => {
		setNewRefresh((prev) => prev + 1);
	};

	// Recalculate `totalProgress` when `fileStates` changes
	useEffect(() => {
		if (fileStates.length === 0) {
			setTotalProgress(0);
			return;
		}

		// Calculate the total progress as an average of all file progress
		const totalUploaded = fileStates.reduce((acc, fs) => acc + fs.progress, 0);
		console.log("totalUploaded", totalUploaded);
		const totalFiles = fileStates.length;
		setTotalProgress(Math.round(totalUploaded / totalFiles));
	}, [fileStates]);

	// Handle file selection
	const onDrop = async (acceptedFiles: File[]) => {
		setIsProcessing(true);
		const validFiles: File[] = [];
		const invalidFiles: File[] = [];
		const convertedFiles: File[] = [];

		for (const file of acceptedFiles) {
			if (file.size > maxFileSize) {
				invalidFiles.push(file);
			} else if (file.type === "image/heic") {
				try {
					const convertedFile = await convertToJPG(file);
					convertedFiles.push(convertedFile);
				} catch {
					invalidFiles.push(file); // If conversion fails, treat as invalid
				}
			} else {
				validFiles.push(file);
			}
		}

		// Combine converted and valid files
		const allValidFiles = [...validFiles, ...convertedFiles];

		// Add valid files with "PENDING" state
		setFileStates((prev) => [
			...prev,
			...allValidFiles.map((file) => ({
				file,
				state: "PENDING" as const,
				progress: 0,
			})),
		]);

		if (invalidFiles.length) {
			setFailedUploads((prev) => [...prev, ...invalidFiles]);
			alert("Some files were too large and have been rejected.");
		}

		// Start uploading each valid file
		allValidFiles.forEach((file) => uploadMediaFile(file));
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
			"image/heic": [],
			"video/*": [],
		},
		onDragEnter: () => setIsDragging(true),
		onDragLeave: () => setIsDragging(false),
	});

	// Update the state of a specific file
	const updateFileState = (file: File, changes: Partial<FileState>) => {
		setFileStates((prev) =>
			prev.map((fs) => (fs.file === file ? { ...fs, ...changes } : fs))
		);
	};

	// Upload a single file
	const uploadMediaFile = async (file: File) => {
		const authToken = await fetchSBAuthToken();
		try {
			// Set the file state to "UPLOADING"
			updateFileState(file, { state: "UPLOADING", progress: 0 });

			const formData = new FormData();
			formData.append("file", file);
			formData.append("convertImagesToWebp", convertImagesToWebp.toString()); // Pass as a string
			if (limitMaxWidthHeight) {
				formData.append("limitMaxWidthHeight", limitMaxWidthHeight.toString());
			}

			const uploadFile = await axios.post(
				"/api/media-uploads/upload-media",
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
					onUploadProgress: (progressEvent) => {
						let progress = Math.round(
							progressEvent.total
								? (progressEvent.loaded * 100) / progressEvent.total
								: 0
						);

						// Cap progress at 95%
						progress = Math.min(progress, 95);

						// Update individual file progress
						updateFileState(file, { progress });
					},
				}
			);

			// Set the file state to "PROCESSING" after upload
			updateFileState(file, { state: "PROCESSING", progress: 95 });

			// Simulate processing delay (if needed, replace with actual API logic)
			// await new Promise((resolve) => setTimeout(resolve, 1000));

			// Set the file state to "COMPLETED" and progress to 100% once processing is confirmed by the server
			if (uploadFile.data.success) {
				updateFileState(file, { state: "COMPLETED", progress: 100 });
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			setFailedUploads((prev) => [...prev, file]);
		}
	};

	// Handle once uploads are complete - sets totalProgress back to 0 after 2 seconds
	useEffect(() => {
		if (totalProgress === 100) {
			handleIncrement();
			const timeout = setTimeout(() => {
				setTotalProgress(0);
				setIsProcessing(false);
				// Clear uploaded queue
				setFileStates([]);
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [totalProgress]);

	// Cancel an upload
	// const cancelUpload = (file: File) => {
	// 	// TODO: Implement cancel logic
	// 	alert(`Canceling upload for ${file.name} is not yet implemented.`);
	// };

	// if (error) {
	// 	return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
	// }

	return (
		<div className="p-6">
			<div
				{...getRootProps()}
				className={clsx(
					isDragging ? "bg-green-800/20" : "",
					isProcessing
						? "cursor-not-allowed pointer-events-none animate-pulse"
						: "cursor-pointer",
					"border-dashed border-2 border-gray-600 hover:border-gray-400 rounded-md p-4 text-center group"
				)}>
				<input {...getInputProps()} />
				<p>
					Drag and drop your photos/videos here, or{" "}
					<span className="group-hover:underline cursor-pointer">
						click to select files.
					</span>
				</p>
				<p className="text-sm text-gray-500">Max file size: 50MB</p>
			</div>

			{showAdvancedOptions ? (
				<div className="text-xs">
					<div className="flex justify-end items-center mt-4">
						<label htmlFor="convertImagesToWebp" className="flex items-center">
							<input
								type="checkbox"
								id="convertImagesToWebp"
								className="accent-sky-500 size-4 rounded"
								checked={convertImagesToWebp}
								onChange={() => setConvertImagesToWebp((prev) => !prev)}
							/>
							<span className="ml-2">Convert images to WebP</span>
						</label>
					</div>

					<div className="flex justify-end items-center mt-4">
						<span className="mr-3">Image Resizing: </span>
						{/* 3x radios with setLimitMaxWidthHeight to be either none, 2048 or 1024 */}
						<label
							htmlFor="limitMaxWidthHeightNONE"
							className="flex items-center">
							<input
								type="radio"
								id="limitMaxWidthHeightNONE"
								className="accent-sky-500 size-4 rounded"
								checked={limitMaxWidthHeight === null}
								onChange={() => setLimitMaxWidthHeight(null)}
							/>
							<span className="ml-2">None *</span>
						</label>
						<label
							htmlFor="limitMaxWidthHeight2048"
							className="flex items-center ml-4">
							<input
								type="radio"
								id="limitMaxWidthHeight2048"
								className="accent-sky-500 size-4 rounded"
								checked={limitMaxWidthHeight === 2048}
								onChange={() => setLimitMaxWidthHeight(2048)}
							/>
							<span className="ml-2">Max 2048px</span>
						</label>
						<label
							htmlFor="limitMaxWidthHeight1024"
							className="flex items-center ml-4">
							<input
								type="radio"
								id="limitMaxWidthHeight1024"
								className="accent-sky-500 size-4 rounded"
								checked={limitMaxWidthHeight === 1280}
								onChange={() => setLimitMaxWidthHeight(1280)}
							/>
							<span className="ml-2">Max 1280px</span>
						</label>
					</div>
					{limitMaxWidthHeight === null && (
						<div className="text-xs text-yellow-500 flex justify-end mt-2">
							* Not recommended! Images could be very large.
						</div>
					)}
				</div>
			) : (
				<div className="flex justify-end mt-2">
					<button
						className="opacity-50 hover:opacity-100 text-2xl"
						onClick={() => setShowAdvancedOptions(true)}>
						<BiCog className="hover:animate-spin" />
					</button>
				</div>
			)}
			{isProcessing && (
				<h3 className="font-bold text-lg flex items-center gap-2 text-sky-500">
					<LoaderSmall />
					<span>Processing...</span>
				</h3>
			)}

			{totalProgress > 0 && (
				<>
					<div className="mt-6">
						<h3 className="font-bold text-lg mb-2">Overall Progress</h3>
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
							<div
								className={clsx(
									totalProgress < 100
										? "bg-blue-600 animate-pulse"
										: "bg-green-600",
									" h-2.5 rounded-full"
								)}
								style={{ width: `${totalProgress}%` }}></div>
						</div>
						<p>{totalProgress}%</p>
					</div>
					<div className="mt-6">
						<h3 className="font-bold text-lg mb-2">Upload Queue</h3>
						{fileStates.length > 0 ? (
							<ul>
								{fileStates.map(({ file, state, progress }) => (
									<li key={file.name} className="flex items-center gap-4 mb-2">
										<span>{file.name}</span>
										<span className="text-sm text-gray-500">
											{state} ({progress}%)
										</span>
										{/* Cancel upload - removed for now... no point */}
										{/* {state === "UPLOADING" && (
											<button
												className="text-red-600 hover:underline"
												onClick={() => cancelUpload(file)}>
												Cancel
											</button>
										)} */}
									</li>
								))}
							</ul>
						) : (
							<p>No files in the queue.</p>
						)}
					</div>
				</>
			)}

			{failedUploads.length > 0 && (
				<div className="mt-6">
					<h3 className="font-bold text-lg mb-2">Failed Uploads</h3>

					<ul>
						{failedUploads.map((file) => (
							<li
								key={file.name}
								className="flex items-center gap-4 text-red-500">
								{file.name}
								<button
									className="text-blue-600 hover:underline"
									onClick={() => uploadMediaFile(file)}>
									Retry
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MediaUploader;
