'use strict';

import Jimp from 'jimp';

const imageCropper = (imagePath) => {
	Jimp.read(imagePath, (err, image) => {
		if (err) return err;		

		let centerX = Number(image.bitmap.width)/2,
			centerY = Number(image.bitmap.height)/2,
			cropX = centerX - (300/2),
			cropY = centerY - (300/2);

		image.crop(cropX, cropY, 300, 300)
			 .write(`./uploads/cropped/cropped_images.jpg`);
	});
}

module.exports = {
	imageCropper: imageCropper
};