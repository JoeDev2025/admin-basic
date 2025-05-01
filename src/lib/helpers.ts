export const bytesToHumanReadable = (bytes: number) => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};


// Slug auto-generation function
export const generateSlug = (name: string) => {
	return (
		name
			.toLowerCase()
			// Lets remove ' and " from the string
			.replace(/['"]+/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
	);
};


/**
 * Formats a number, string, or float according to a specific locale.
 * If the number is a whole number or ends with .00, the last two decimal digits are not displayed.
 * 
 * @param value - The number, string, or float to format.
 * @param locale - The locale to format the number in (default is 'en-US').
 * @returns The formatted number as a string.
 */
export function priceFormatNumber(value: number | string, locale: string = 'en-US'): string {
	let numberValue: number;

	if (typeof value === 'string') {
			numberValue = parseFloat(value);
	} else {
			numberValue = value;
	}

	const options: Intl.NumberFormatOptions = {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
	};

	const formattedNumber = new Intl.NumberFormat(locale, options).format(numberValue);

	// Remove trailing '.00' if present
	if (formattedNumber.endsWith('.00')) {
			return formattedNumber.slice(0, -3);
	}

	return formattedNumber;
}
