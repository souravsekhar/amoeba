'use strict';

import fs from 'fs';
import multiparty from 'multiparty';
import ImageProcessor from './imageProcessor';
import ImageCropper from './imageCropper';
import FormatHandler from './formatHandler';
import path from 'path';
import async from 'async';

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
					// ImageProcessor.imageProcessor(newPath, files.imageFile[0].originalFilename);
					// ImageCropper.imageCropper(newPath); // temporary for testing					
					// reply('Uploaded');
					processImagesSync(newPath, fields, files);
				});
			}else {
				reply('You cannot upload' + path.extname(files.imageFile[0].path) + ' files');
			}
		});				
	});

	const processImagesSync = (newPath, fields, files) => {
		const imageName = files.imageFile[0].originalFilename,
			  asyncArr = [],
			  orderArr = fields.order[0].split(',');

		orderArr.forEach((operation) => {							
			switch(operation) {
				case 'Crop':					
					asyncArr.push((callback) => {						
						ImageCropper.imageCropper(newPath, imageName, fields, callback);
					});
					break;
				case 'Format':
					asyncArr.push((callback) => {
						FormatHandler.formatHandler(newPath, imageName, fields, callback);
					});
					break;
				// case 'Resize':
					
			}
		});
				
		async.series(asyncArr, (err, results) => {
			if (err) return err;
		});
	}	
}

module.exports = {
	uploadHandler: uploadHandler
};
