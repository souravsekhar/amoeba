'use strict';

import Jimp from 'jimp';

const imageResizer = (req, callback) => {
	let imageName = req && req.imageFileName,
		dimensions = {
			width: req && req.resize && req.resize.dimension,
			height: req && req.resize && req.resize.dimension
		},
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let height = dimensions.height,
			width = dimensions.width,
			fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/resized/resized_images_${fileName}${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.resize(height, width)
			 .write(uploadPath, (err) => {
			 	if (err) return err;			 	
			 	callback(null, uploadPath);
			 });
	});
}

module.exports = {
	imageResizer: imageResizer
}