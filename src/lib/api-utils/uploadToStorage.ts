import { supabaseBACKEND } from "./API-BACKEND-CLIENT";

export const uploadToStorage = async (
	path: string,
	fileBuffer: Buffer,
	contentType: string | undefined
) => {
	const { data, error } = await supabaseBACKEND.storage
		.from("media_uploads_bucket")
		.upload(path, fileBuffer, {
			contentType,
			upsert: true,
		});

	if (error) {
		throw error;
	}

	return data;
};
