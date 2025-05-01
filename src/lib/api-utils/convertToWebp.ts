import sharp from "sharp";

export const convertToWebp = async (
	fileBuffer: Buffer,
	preserveTransparency: boolean,
	quality: number = 75 // Default quality is 80
): Promise<Buffer> => {
	return await sharp(fileBuffer)
		.webp({
			quality, // Set WebP quality
			alphaQuality: preserveTransparency ? 100 : undefined, // Preserve transparency for PNGs
		})
		.toBuffer();
};