import formidable from "formidable";

import { IncomingMessage } from "http";

export const parseForm = async (req: IncomingMessage) => {
	const form = formidable({ multiples: true });
	return new Promise<{
		fields: formidable.Fields;
		files: formidable.Files;
	}>((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			resolve({ fields, files });
		});
	});
};
