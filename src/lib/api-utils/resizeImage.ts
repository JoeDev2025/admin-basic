import sharp from "sharp";

export const resizeImage = async (
	fileBuffer: Buffer,
	maxWidthHeight: number = 500
): Promise<Buffer> => {
	return await sharp(fileBuffer)
		.rotate() // Fix EXIF rotation for images
		.resize(maxWidthHeight, maxWidthHeight, { fit: "inside" }) // Resize to max 500px width/height
		.toBuffer();
};
