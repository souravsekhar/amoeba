'use strict';

import Jimp from 'jimp';

function invertHandler (req, callback) {

	let imageName = req && req.imageFileName,
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/inverted/inverted_images_${fileName}.${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.invert()
			 .write(uploadPath, (err) => {
			 	if (err) return err;
			 	callback(null, uploadPath);
			 });		
	});
}

module.exports = {
	invertHandler: invertHandler
}