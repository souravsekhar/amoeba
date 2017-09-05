'use strict';

import ImageCropper from './imageCropper.js';
import FormatHandler from './formatHandler.js';
import ImageResizer from './imageResizer.js';
import async from 'async';
import Jimp from 'jimp';
import fs from 'fs';

const operationsHandler = (request, reply) => {
	const req = request && request.payload,
		  orderArr = JSON.parse(req.operationOrder),
	      asyncArr = [],
		  imagePath = '.' + req.imagePath,
		  imageName = req && req.imageFileName,
		  fileFormat = req && req.formats && req.formats.format;

	req.intermediateImagePath = [];

	if (req.multiGenerate) {// handles operations sequentially and stores out put on each step
		orderArr.forEach((operation) => {					
			switch(operation) {
				case 'Crop':					
					asyncArr.push((callback) => {						
						ImageCropper.imageCropper(req, callback);
					});
					break;
					
				case 'Format':
					asyncArr.push((callback) => {						
						FormatHandler.formatHandler(req, callback);
					});
					break;
				case 'Resize':
					asyncArr.push((callback) => {					
						ImageResizer.imageResizer(req, callback);
					});
					break;	
			}
		});

		async.series(asyncArr, (err, results) => {
			if (err) return err;			
		});
	}
	else {// handles operations sequentially, however stores only the final output
		orderArr.forEach((operation) => {			
			switch(operation) {
				case 'Crop':				
					if (orderArr[0] === 'Crop') {

						asyncArr.push((callback) => {						
							ImageCropper.imageCropper(req, callback);
						});
					}
					else {
						asyncArr.push((imagePath, callback) => {						
							ImageCropper.imageCropper(req, callback);
						});
					}				
					break;
					
				case 'Format':
					if (orderArr[0] === 'Format') {	

						asyncArr.push((callback) => {						
							FormatHandler.formatHandler(req, callback);
						});
					}
					else {						
						asyncArr.push((imagePath, callback) => {						
							FormatHandler.formatHandler(req, callback);
						});
					}
					break;
				case 'Resize':
					if (orderArr[0] === 'Resize') {	

						asyncArr.push((callback) => {						
							ImageResizer.imageResizer(req, callback);
						});
					}
					else {						
						asyncArr.push((imagePath, callback) => {						
							ImageResizer.imageResizer(req, callback);
						});
					}				
					break;	
			}		
		});
		
		async.waterfall(asyncArr, (err, results) => {
			if (err) return err;
					
			Jimp.read(results, (err, image) => {
				if (err) return err;
				
				let fileFormat = results.substring(results.lastIndexOf('.')),
					fileName = imageName.substring(0, imageName.indexOf('.')),
					uploadPath = `./uploads/processed/processed_images_${fileName}${fileFormat}`;
				
				image.write(uploadPath);

				req.intermediateImagePath.map((path) => {
					fs.unlink(path, (err) => {
						if (err) return err;
					});
				});
				
			});
		});
	}
}


module.exports = {
	operationsHandler: operationsHandler
}