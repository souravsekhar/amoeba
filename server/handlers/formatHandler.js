'use strict';

import Jimp from 'jimp';

const formatHandler = (req, callback) => {
	let imageName = req && req.imageFileName,
		fileFormat = req && req.formats && req.formats.format,
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
				
		let fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/formatted/formatted_images_${fileName}.${fileFormat}`;

		req.intermediateImagePath.push(uploadPath);

		image.write(uploadPath, (err) => {
			if (err) return err;				
			callback(null, uploadPath);
		});
	});
}

module.exports = {
	formatHandler: formatHandler
}