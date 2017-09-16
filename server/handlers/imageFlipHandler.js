'use strict';

import Jimp from 'jimp';
import chalk from 'chalk';

function imageFlipHandler (req, callback) {

	console.log(chalk.yellow('---------- FLIPPING INITIATED ----------'));

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

			 	console.log(chalk.green('---------- FLIPPING COMPLETED ----------'));
			 	console.log(chalk.cyan(`${fileName}${fileExtn}`) + ' has been flipped and stored at' + chalk.cyan(` ${uploadPath}`));

			 	callback(null, uploadPath);
			 });		
	});
}

module.exports = {
	imageFlipHandler: imageFlipHandler
}