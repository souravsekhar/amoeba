'use strict';

import Jimp from 'jimp';
import chalk from 'chalk';

const imageResizer = (req, callback) => {

	console.log(chalk.yellow('---------- RESIZING INITIATED ----------'));

	let imageName = req && req.imageFileName,
		dimensions = {
			width: req && Number(req.resize.split('x')[0]),
			height: req && Number(req.resize.split('x')[1])
		},
		imagePath = req.imagePath;

	Jimp.read(imagePath, (err, image) => {
		if (err) return err;

		let height = dimensions.height,
			width = dimensions.width,
			fileExtn = imageName.substring(imageName.indexOf('.')),
			fileName = imageName.substring(0, imageName.indexOf('.')),
			uploadPath = `./uploads/resized/resized_images_${fileName}${fileExtn}`;

		req.intermediateImagePath.push(uploadPath);

		image.resize(height, width)
			 .write(uploadPath, (err) => {
			 	if (err) return err;

			 	console.log(chalk.green('---------- RESIZING COMPLETED ----------'));
			 	console.log(chalk.cyan(`${fileName}${fileExtn}`) + ' has been resized and uploaded to' + chalk.cyan(` ${uploadPath}`));

			 	callback(null, uploadPath);
			 });
	});
}

module.exports = {
	imageResizer: imageResizer
}
