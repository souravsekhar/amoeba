'use strict';

import Jimp from 'jimp';
import chalk from 'chalk';

const formatHandler = (req, callback) => {
	console.log(chalk.yellow('---------- IMAGE TYPE FORMATTING INITIATED ----------'));

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

			console.log(chalk.green('---------- IMAGE FORMATTING COMPLETED ----------'));
			console.log(chalk.cyan(`${fileName}${fileFormat}`) + ' has been formatted and stored at' + chalk.cyan(` ${uploadPath}`));

			callback(null, uploadPath);
		});
	});
}

module.exports = {
	formatHandler: formatHandler
}