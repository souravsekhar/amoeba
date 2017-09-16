'use strict';

import fs from 'fs';
import multiparty from 'multiparty';
import ImageProcessor from './imageProcessor';
import ImageCropper from './imageCropper';
import FormatHandler from './formatHandler';
import path from 'path';
import async from 'async';
import chalk from 'chalk';

const imageUploadHandler = (req, reply) => {// uploads the received image to disk currently

	console.log(chalk.yellow('---------- SINGLE IMAGE UPLOADING INITIATED ----------'));

	let form = new multiparty.Form(),
		allowedImageTypes = ['.png', '.jpg'];		
	form.parse(req.payload, (error, fields, files) => {	
		if (error) return error;
		fs.readFile(files.imageFile[0].path, (error, data) => {			
			if (error) return error;

			if (allowedImageTypes.indexOf(path.extname(files.imageFile[0].path)) > -1){// validates the file extension
				let newPath = "./uploads/originals/" + files.imageFile[0].originalFilename; //TODO: create unique file names
				fs.writeFile(newPath, data, (error) => {// creates a new file if doesn't exist and overwrites the existing one if exists										
					if (error) return error;	

					console.log(chalk.green('********** IMAGE HAS BEEN SUCCESSFULLY UPLOADED **********'));								
					reply(newPath);				
				});
			}else {				
				console.log(chalk.red(chalk.bold(path.extname(files.imageFile[0].path)) + ' FILES ARE CURRENTLY NOT SUPPORTED'));
				reply('You cannot upload' + path.extname(files.imageFile[0].path) + ' files');
			}
		});				
	});
}
module.exports = {
	imageUploadHandler: imageUploadHandler
};
