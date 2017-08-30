'use strict';

import Jimp from 'jimp';

const imageCropper = (imagePath, fields, callback) => {	
	Jimp.read(imagePath, (err, image) => {
		if (err) return err;		

		let centerX = Number(image.bitmap.width)/2,
			centerY = Number(image.bitmap.height)/2,
			cropWidth = Number(fields.cropWidth[0]),
			cropHeight = Number(fields.cropHeight[0]),
			cropX = centerX - (cropWidth/2),
			cropY = centerY - (cropHeight/2);

		image.crop(cropX, cropY, cropWidth, cropHeight)
			 .write(`./uploads/cropped/cropped_images.jpg`);

		callback(null, `./uploads/cropped/cropped_images.jpg`);
	});
}

module.exports = {
	imageCropper: imageCropper
};