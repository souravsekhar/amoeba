'use strict';

import Jimp from 'jimp';

function formatHandler (imagePath, imageName, fields, callback) {	
	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = fields.formatsSelect[0],
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/formatted/formatted_images_${fileName}.${fileExtn}`;

		image.write(uploadPath);
		
		callback(null, uploadPath);
	});
}

module.exports = {
	formatHandler: formatHandler
}