'use strict';

import Jimp from 'jimp';

const imageResizer = (imagePath, imageName, fields, callback) => {
	console.log('inside imageResizer', fields);
	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let dimensions = fields.imageDimensions[0].split(' x '),
			height = dimensions[0],
			width = dimensions[1],
			fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/resized/resized_images_${fileName}.${fileExtn}`;

		image.resize(height, width)
			 .write(uploadPath);
		
		callback(null, uploadPath);
	});
}