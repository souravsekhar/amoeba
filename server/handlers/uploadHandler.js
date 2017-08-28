'use strict';

import fs from 'fs';
import multiparty from 'multiparty';
import ImageProcessor from './imageProcessor'
import path from 'path';

const uploadHandler = (req, reply) => {// uploads the received image to disk currently
	let form = new multiparty.Form(),
		allowedImageTypes = ['.png', '.jpg'];
	form.parse(req.payload, (error, fields, files) => {
		if (error) return error;		
		fs.readFile(files.imageFile[0].path, (error, data) => {
			if (error) return error;
			if (allowedImageTypes.indexOf(path.extname(files.imageFile[0].path)) > -1){// validates the file extension
				let newPath = "./uploads/originals/" + files.imageFile[0].originalFilename; //TODO: create unique file names
				fs.writeFile(newPath, data, (error) => {// creates a new file if doesn't exist and overwrites the existing one if exists
					if (error) return error;
					ImageProcessor.imageProcessor(newPath, files.imageFile[0].originalFilename);
					reply('Uploaded');
				});
			}else {
				reply('You cannot upload' + path.extname(files.imageFile[0].path) + ' files');
			}
		});
	});
}

module.exports = {
	uploadHandler: uploadHandler
};
