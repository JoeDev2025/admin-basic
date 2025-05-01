import { supabaseCLIENT } from "@/lib/supabaseClient";

export const checkFileViaUrl = async (
	bucketName: string,
	filePath: string
): Promise<boolean> => {
	const { data } = supabaseCLIENT.storage
		.from(bucketName)
		.getPublicUrl(filePath);
	const url = data.publicUrl;

	try {
		const response = await fetch(url, { method: "HEAD" });
		return response.ok; // Returns true if the file exists
	} catch {
		return false;
	}
};
