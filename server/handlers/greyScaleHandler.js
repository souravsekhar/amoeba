'use strict';

import Jimp from 'jimp';
import chalk from 'chalk';

function greyScaleHandler (req, callback) {

	console.log(chalk.yellow('---------- GREY-SCALING INITIATED ----------'));

	let imageName = req && req.imageFileName,
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {		
		if (err) return err;
		
		let fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/greyScaled/greyScaled_images_${fileName}.${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.greyscale()
			 .write(uploadPath, (err) => {
			 	if (err) return err;

			 	console.log(chalk.green('---------- GREY-SCALING COMPLETED ----------'));
			 	console.log(chalk.cyan(`${fileName}${fileExtn}`) + ' has been greyscaled and stored at' + chalk.cyan(` ${uploadPath}`));	

			 	callback(null, uploadPath);
			 });
	});
}

module.exports = {
	greyScaleHandler: greyScaleHandler
}