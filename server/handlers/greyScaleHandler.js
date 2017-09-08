'use strict';

import Jimp from 'jimp';

function greyScaleHandler (req, callback) {

	let imageName = req && req.imageFileName,
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/greyScaled/greyScaled_images_${fileName}.${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.greyscale()
			 .write(uploadPath, (err) => {
			 	if (err) return err;
			 	callback(null, uploadPath);
			 });
	});
}

module.exports = {
	greyScaleHandler: greyScaleHandler
}