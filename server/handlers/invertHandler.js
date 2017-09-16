'use strict';

import Jimp from 'jimp';
import chalk from 'chalk';

function invertHandler (req, callback) {
	console.log(chalk.yellow('---------- INVERTING INITIATED ----------'));
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
			 	console.log(chalk.green('---------- INVERTING COMPLETED ----------'));
			 	console.log(chalk.cyan(`${fileName}${fileExtn}`) + ' has been inverted and stored at' + chalk.cyan(` ${uploadPath}`));	
			 	callback(null, uploadPath);
			 });		
	});
}

module.exports = {
	invertHandler: invertHandler
}