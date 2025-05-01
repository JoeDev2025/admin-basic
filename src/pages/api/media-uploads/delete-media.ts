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
	const { mediaId } = req.body;

	if (!mediaId) {
		return ERROR_API_OUTPUT(res, "Missing required mediaId", 400);
	}

	try {
		// Fetch the storage and thumbnail paths for the specified media
		const { data: media, error: mediaError } = await supabaseBACKEND
			.from("media_uploads")
			.select("storage_path, thumbnail_path")
			.eq("media_id", mediaId)
			// .eq("user_id", req.user.id)
			.single();

		if (mediaError || !media) {
			return ERROR_API_OUTPUT(
				res,
				"Failed to fetch media or media not found",
				404
			);
		}

		const { storage_path: storagePath, thumbnail_path: thumbnailPath } = media;

		// if (!storagePath || !thumbnailPath) {
		// 	return ERROR_API_OUTPUT(res, "Missing storage or thumbnail path", 400);
		// }

		// Delete the files from Supabase Storage
		const { error: storageError } = await supabaseBACKEND.storage
			.from("media_uploads_bucket") // Replace with your bucket name
			.remove([storagePath, thumbnailPath]);

		if (storageError) {
			throw new Error(
				`Failed to delete files from storage: ${storageError.message}`
			);
		}

		// Remove the metadata from the `media_uploads` table
		const { error: deleteError } = await supabaseBACKEND
			.from("media_uploads")
			.delete()
			.eq("media_id", mediaId);
		// .eq("user_id", req.user.id); // Ensure only the authenticated user's data is affected

		if (deleteError) {
			throw new Error(`Failed to delete media record: ${deleteError.message}`);
		}

		SUCCESS_API_OUTPUT(res, { message: "Media deleted successfully" });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		ERROR_API_OUTPUT(res, `Failed to delete media: ${errorMessage}`, 500);
	}
};

export default PROTECTED_API(handler, ["DELETE"]);
