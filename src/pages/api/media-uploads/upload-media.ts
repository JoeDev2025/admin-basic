import { supabasePUBLIC_URL, supabaseSTORAGE_PATH } from "@/lib/supabaseClient";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { supabaseBACKEND } from "../../../lib/api-utils/API-BACKEND-CLIENT";
import {
	ERROR_API_OUTPUT,
	PROTECTED_API,
	SUCCESS_API_OUTPUT,
} from "../../../lib/api-utils/API-MIDDLEWARE";
import { convertToWebp } from "../../../lib/api-utils/convertToWebp";
import { extractPoster } from "../../../lib/api-utils/extractPoster";
import { parseForm } from "../../../lib/api-utils/parseForm";
import { resizeImage } from "../../../lib/api-utils/resizeImage";
import { uploadToStorage } from "../../../lib/api-utils/uploadToStorage";

export const config = {
	api: {
		bodyParser: false, // Disable body parser to handle file uploads with formidable
	},
};

const THUMBNAIL_MAX_WIDTH_HEIGHT = 256;
const POSTER_MAX_WIDTH_HEIGHT = 1024;

const handler = async (
	req: NextApiRequest & { user: { id: string } },
	res: NextApiResponse
) => {
	const mimeTypesToConvert = ["image/jpeg", "image/png"];

	try {
		// Parse the incoming form data to extract files
		const { fields, files } = await parseForm(req);

		// Do we want to convert images to WebP?
		const convertImagesToWebp = Array.isArray(fields.convertImagesToWebp)
			? fields.convertImagesToWebp[0] === "true"
			: fields.convertImagesToWebp === "true";

		// Limit the max width/height of images
		const limitMaxWidthHeight = Array.isArray(fields.limitMaxWidthHeight)
			? parseInt(fields.limitMaxWidthHeight[0])
			: fields.limitMaxWidthHeight
				? parseInt(fields.limitMaxWidthHeight)
				: undefined;

		// Do we also want to limit the thumbnail size?
		const limitThumbnailMaxWidthHeight = Array.isArray(
			fields.limitThumbnailMaxWidthHeight
		)
			? parseInt(fields.limitThumbnailMaxWidthHeight[0])
			: fields.limitThumbnailMaxWidthHeight
				? parseInt(fields.limitThumbnailMaxWidthHeight)
				: 0;

		// Check if the file is used elsewhere e.g blog post, profile image etc
		const usedElsewhere = Array.isArray(fields.used_elsewhere)
			? fields.used_elsewhere[0]
			: fields.used_elsewhere;

		if (!files || !files.file) {
			return ERROR_API_OUTPUT(res, "Invalid file data", 400);
		}

		const file = Array.isArray(files.file) ? files.file[0] : files.file;
		let fileBuffer = await fs.readFile(file.filepath);
		let ext = file.originalFilename?.split(".").pop();

		if (!ext) {
			return ERROR_API_OUTPUT(res, "File extension missing", 400);
		}

		if (
			convertImagesToWebp &&
			file.mimetype &&
			mimeTypesToConvert.includes(file.mimetype)
		) {
			ext = "webp";
		}

		// Insert a record into the database to get `media_id`, `count_id` and `random_number`
		const { data: insertData, error: insertError } = await supabaseBACKEND
			.from("media_uploads")
			.insert({
				user_id: req.user.id,
				original_filename: file.originalFilename,
				status: "pending",
				created_at: new Date(),
			})
			.select("count_id, random_number, media_id")
			.single();

		if (insertError || !insertData) {
			throw insertError || new Error("Insert failed");
		}

		const { count_id, random_number, media_id } = insertData;
		const paddedCountId = count_id.toString().padStart(5, "0");
		const newFileName = `${paddedCountId}-${random_number}.${ext}`;
		const subfolder = file.mimetype?.startsWith("video/") ? "videos" : "images";

		const filePath = `${subfolder}/${newFileName}`;

		let thumbnailPath;

		// Generate a poster for videos
		if (file.mimetype?.startsWith("video/")) {
			const uniqueId = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 15)}`;
			const tempVideoPath = `/tmp/${uniqueId}-${file.originalFilename}`;
			await fs.writeFile(tempVideoPath, fileBuffer);

			const posterBuffer = await extractPoster(tempVideoPath, uniqueId);
			const resizedPosterBuffer = await resizeImage(
				posterBuffer,
				POSTER_MAX_WIDTH_HEIGHT
			);
			const webpPosterBuffer = await convertToWebp(resizedPosterBuffer, false);
			thumbnailPath = `posters/${newFileName.replace(/\.\w+$/, ".webp")}`;
			await uploadToStorage(thumbnailPath, webpPosterBuffer, "image/webp");
		}

		// Generate a thumbnail for images
		if (file.mimetype?.startsWith("image/")) {
			const resizedBuffer = await resizeImage(
				fileBuffer,
				limitThumbnailMaxWidthHeight > 0
					? limitThumbnailMaxWidthHeight
					: THUMBNAIL_MAX_WIDTH_HEIGHT
			);
			const preserveTransparency = file.mimetype === "image/png";
			const webpThumbnailBuffer = await convertToWebp(
				resizedBuffer,
				preserveTransparency
			);
			thumbnailPath = `thumbnails/${newFileName.replace(/\.\w+$/, ".webp")}`;
			await uploadToStorage(thumbnailPath, webpThumbnailBuffer, "image/webp");
		}

		// Resize images if specified
		if (
			limitMaxWidthHeight &&
			file.mimetype &&
			mimeTypesToConvert.includes(file.mimetype)
		) {
			fileBuffer = await resizeImage(fileBuffer, limitMaxWidthHeight);
			file.size = fileBuffer.length;
		}

		// Convert images to WebP if specified
		if (
			convertImagesToWebp &&
			file.mimetype &&
			mimeTypesToConvert.includes(file.mimetype)
		) {
			const webpBuffer = await convertToWebp(fileBuffer, true);
			const webpPath = `images/${newFileName.replace(/\.\w+$/, ".webp")}`;
			await uploadToStorage(webpPath, webpBuffer, "image/webp");
			file.size = webpBuffer.length;
		} else {
			await uploadToStorage(filePath, fileBuffer, file.mimetype || undefined);
		}

		// Fix mimetype for QuickTime videos so browser can display them correctly
		let mimetype = file.mimetype;
		if (mimetype === "video/quicktime") {
			mimetype = "video/mp4";
		}

		// Update the database record with the rest of the file metadata now its been uploaded & processed
		const { error: updateError } = await supabaseBACKEND
			.from("media_uploads")
			.update({
				file_name: newFileName,
				file_type: mimetype,
				file_size: file.size,
				storage_path: filePath,
				thumbnail_path: thumbnailPath,
				used_elsewhere: usedElsewhere || null,
				status: "uploaded",
			})
			.eq("media_id", media_id)
			.eq("user_id", req.user.id);

		if (updateError) {
			throw updateError;
		}

		SUCCESS_API_OUTPUT(res, {
			message: "File uploaded and metadata updated successfully",
			filePath,
			original_filename: file.originalFilename,
			url: `${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${filePath}`,
			thumbnail_url: `${supabasePUBLIC_URL}${supabaseSTORAGE_PATH}media_uploads_bucket/${thumbnailPath}`,
		});
	} catch (error) {
		console.error("Upload error:", error);
		ERROR_API_OUTPUT(res, "Upload failed", 500);
	}
};

export default PROTECTED_API(handler, ["POST"]);
