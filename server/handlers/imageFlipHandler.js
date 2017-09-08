'use strict';

import Jimp from 'jimp';

function imageFlipHandler (req, callback) {
	let imageName = req && req.imageFileName,
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/flipped/flipped_images_${fileName}.${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.flip(true, false) // TODO:takes param 'horizontally' or 'vertically'
			 .write(uploadPath, (err) => {
			 	if (err) return err;
			 	callback(null, uploadPath);
			 });		
	});
}

module.exports = {
	imageFlipHandler: imageFlipHandler
}