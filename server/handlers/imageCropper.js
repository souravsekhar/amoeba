'use strict';

import Jimp from 'jimp';

const imageCropper = (imagePath, imageName, fields, callback) => {	
	Jimp.read(imagePath, (err, image) => {			
		if (err) return err;		

		let centerX = Number(image.bitmap.width)/2,
			centerY = Number(image.bitmap.height)/2,
			cropWidth = Number(fields.cropWidth[0]),
			cropHeight = Number(fields.cropHeight[0]),
			cropX = centerX - (cropWidth/2),
			cropY = centerY - (cropHeight/2),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			fileExtn = imageName.substring(imageName.indexOf('.')),
			filePath = `./uploads/cropped/cropped_image_${fileName}${fileExtn}`;
		
		image.crop(cropX, cropY, cropWidth, cropHeight)
			 .write(filePath);
		
		callback(null, filePath);
	});
}

module.exports = {
	imageCropper: imageCropper
};