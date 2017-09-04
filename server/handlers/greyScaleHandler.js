'use strict';

import Jimp from 'jimp';

function greyScaleHandler (imagePath, imageName, fields, callback) {	
	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/greyScaled/greyScaled_images_${fileName}.${fileExtn}`;

		image.greyscale()
			 .write(uploadPath);
		
		callback(null, uploadPath);
	});
}

module.exports = {
	greyScaleHandler: greyScaleHandler
}