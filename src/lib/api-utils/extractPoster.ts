import { execSync } from "child_process";
import { promises as fs } from "fs";

export const extractPoster = async (
	videoPath: string,
	uniqueId: string
): Promise<Buffer> => {
	const tempPosterPath = `/tmp/poster_${uniqueId}.jpg`;

	execSync(`ffmpeg -i ${videoPath} -ss 00:00:01 -vframes 1 ${tempPosterPath}`);

	const posterBuffer = await fs.readFile(tempPosterPath);
	await fs.unlink(tempPosterPath);

	return posterBuffer;
};
