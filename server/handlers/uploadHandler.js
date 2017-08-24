'use strict';

import fs from 'fs';
import multiparty from 'multiparty';

const uploadHandler = (req, reply) => {// uploads the received image to disk currently
	let form = new multiparty.Form();
	form.parse(req.payload, (error, fields, files) => {
		if (error) return error;
		fs.readFile(files.imageFile[0].path, (error, data) => {
			if (error) return error;
			let newPath = "./uploads/" + files.imageFile[0].originalFilename; //TODO: create unique file names
			fs.writeFile(newPath, data, (error) => {
				if (error) return error;
			});
		});
	});

	reply("Uploaded");
}

module.exports = {
	uploadHandler: uploadHandler
};