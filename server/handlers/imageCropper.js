'use strict';

import Jimp from 'jimp';

const imageCropper = (req, callback) => {
	let size = {
			height: req && req.crop && req.crop.size,
			width: req && req.crop && req.crop.size
		},
		imageName = req && req.imageFileName,
		imagePath = req.imagePath;
	
	Jimp.read(imagePath, (err, image) => {			
		if (err) return err;		

		let centerX = Number(image.bitmap.width)/2,
			centerY = Number(image.bitmap.height)/2,
			cropWidth = size.width,
			cropHeight = size.height,
			cropX = centerX - (cropWidth/2),
			cropY = centerY - (cropHeight/2),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			fileExtn = imageName.substring(imageName.indexOf('.')),
			uploadPath = `./uploads/cropped/cropped_image_${fileName}${fileExtn}`;		
		
		req.intermediateImagePath.push(uploadPath);

		image.crop(cropX, cropY, cropWidth, cropHeight)
			 .write(uploadPath, (err) => {
			 	if (err) return err;
			 	callback(null, uploadPath);
			 });
	});
}

module.exports = {
	imageCropper: imageCropper
};