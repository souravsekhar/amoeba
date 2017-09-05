'use strict';

import Jimp from 'jimp';

function formatHandler (req, callback) {	
	
	let imagePath = '.' + req.imagePath,
		imageName = req && req.imageFileName,
		fileFormat = req && req.formats && req.formats.format;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
				
		let fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/formatted/formatted_images_${fileName}.${fileFormat}`;

		req.intermediateImagePath.push(uploadPath);

		image.write(uploadPath);
		
		callback(null, uploadPath);
	});
}

module.exports = {
	formatHandler: formatHandler
}