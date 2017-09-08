'use strict';

import ImageCropper from './imageCropper.js';
import FormatHandler from './formatHandler.js';
import ImageResizer from './imageResizer.js';
import GenerateProcessedImage from './generateProcessedImage';
import async from 'async';

const operationsHandler = (imageInfo, request, cb) => {
	const req = request && request.payload,
		  orderArr = JSON.parse(req.operationOrder),
	      asyncArr = [];


	req.intermediateImagePath = [];
	req.imagePath = '.' + imageInfo;
	req.imageFileName = imageInfo.substring(imageInfo.lastIndexOf('/') + 1);

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
			cb(null);
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
							req.imagePath = imagePath;										
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
							req.imagePath = imagePath;																				
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
							req.imagePath = imagePath;																						
							ImageResizer.imageResizer(req, callback);							
						});
					}				
					break;	
			}		
		});

		asyncArr.push((imagePath, callback) => {
			req.imagePath = imagePath;
			GenerateProcessedImage.generateProcessedImage(req, callback);			
		});		
		
		async.waterfall(asyncArr, (err, results) => {			
			if (err) return err;
			cb(null);
		});
	}
}


module.exports = {
	operationsHandler: operationsHandler
}