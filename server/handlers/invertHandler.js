'use strict';

import Jimp from 'jimp';

function invertHandler (imagePath, imageName, fields, callback) {	
	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/inverted/inverted_images_${fileName}.${fileExtn}`;

		image.invert()
			 .write(uploadPath);
		
		callback(null, uploadPath);
	});
}

module.exports = {
	invertHandler: invertHandler
}