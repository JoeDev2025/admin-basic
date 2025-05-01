export const convertToJPG = async (file: File): Promise<File> => {
	if (typeof window === "undefined") {
		throw new Error(
			"HEIC conversion can only be performed on the client side."
		);
	}
	const heic2any = (await import("heic2any")).default;

	try {
		const blob = await heic2any({
			blob: file,
			toType: "image/jpeg",
			quality: 0.7,
		});
		const convertedFile = new File(
			[blob as Blob],
			`${file.name.split(".")[0]}.jpg`,
			{
				type: "image/jpeg",
			}
		);
		return convertedFile;
	} catch (error) {
		console.error("HEIC conversion failed:", error);
		throw error;
	}
};
