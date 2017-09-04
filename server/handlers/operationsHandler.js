'use strict';

import ImageCropper from './imageCropper.js';
import FormatHandler from './formatHandler.js';
import async from 'async';

const operationsHandler = (request, reply) => {
	const req = request && request.payload;
	const orderArr = JSON.parse(req.operationOrder),
	      asyncArr = [],
		  imagePath = '.' + req.imagePath,
		  imageName = req.imageFileName;

	orderArr.forEach((operation) => {							
		switch(operation) {
			case 'Crop':
				let size = {
					height: req && req.crop && req.crop.size,
					width: req && req.crop && req.crop.size
				}					
				asyncArr.push((callback) => {						
					ImageCropper.imageCropper(imagePath, imageName, size, callback);
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

module.exports = {
	operationsHandler: operationsHandler
}