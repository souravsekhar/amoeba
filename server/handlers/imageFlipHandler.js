'use strict';

import Jimp from 'jimp';

function imageFlipHandler (imagePath, imageName, fields, callback) {	
	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/flipped/flipped_images_${fileName}.${fileExtn}`;

		image.flip() // TODO:takes param 'horizontally' or 'vertically'
			 .write(uploadPath);
		
		callback(null, uploadPath);
	});
}

module.exports = {
	imageFlipHandler: imageFlipHandler
}