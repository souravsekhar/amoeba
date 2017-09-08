'use strict';

import Jimp from 'jimp';
import fs from 'fs';

const generateProcessedImage = (req, callback) => {
	let imagePath = req.imagePath,
		imageName = req && req.imageFileName,
		fileFormat = imagePath.substring(imagePath.lastIndexOf('.')),
		fileName = imageName.substring(0, imageName.indexOf('.')),
		uploadPath = `./uploads/processed/processed_images_${fileName}${fileFormat}`;

	Jimp.read(imagePath, (err, image) => {	
		if (err) return err;		
		
		image.write(uploadPath, (err) => {			
			if (err) return err;

			req.intermediateImagePath.map((path) => {								
				fs.unlink(path, (err) => {				
					if (err) return err;						
				});
			});

			callback(null, 'process successful');
		});		
	});
}

module.exports = {
	generateProcessedImage: generateProcessedImage
};