'use strict';

import fs from 'fs';
import multiparty from 'multiparty';
import ImageProcessor from './imageProcessor'

const uploadHandler = (req, reply) => {// uploads the received image to disk currently
	let form = new multiparty.Form();
	form.parse(req.payload, (error, fields, files) => {
		if (error) return error;
		console.log("files == ", files);
		fs.readFile(files.imageFile[0].path, (error, data) => {
			if (error) return error;
			let newPath = "./uploads/" + files.imageFile[0].originalFilename; //TODO: create unique file names
			fs.writeFile(newPath, data, (error) => {
				if (error) return error;
				ImageProcessor.imageProcessor(newPath);
			});
		});
	});

	reply("Uploaded");
}

module.exports = {
	uploadHandler: uploadHandler
};
