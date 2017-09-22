'use strict';

import fs from 'fs';
import async from 'async';
import OperationsHandler from './operationsHandler.js';
import SaveConfig from './saveConfig.js';
import chalk from 'chalk';

const multipleUploadsHandler = (request, cb) => {
	let sourcePath = './uploads/batch_src/' + (request.payload && request.payload.sourcePath),
		imagePathArr = [];

	console.log("sourcePath", sourcePath);
	const multipleProcessor = () => {
		// let files = fs.readdirSync(sourcePath);
		let allFiles = fs.readdirSync(sourcePath);
		let files = [];

		// files.splice(0, 2);
		// console.log('files', allFiles);
		// console.log('done index -----------', allFiles[1]);
		// files.forEach((f, i) => {
		// 	console.log('f', f);
		// 	console.log('index', i);
		// 	// if (f.indexOf('.') === 0) {				
		// 	// 	files.splice(f.indexOf(f), 1);
		// 	// }

		// 	// console.log('f.indexOf(f)', f.indexOf(f));
		// 	if(f === '.done' || f === '.DS_Store'){
		// 		// console.log('f.indexOf(f)', f.indexOf(f));
		// 		files.splice(i, 1);
		// 	}
		// });

		allFiles.forEach((f) => {
			if (f !== '.done' && f !== '.DS_Store') {
				files.push(f);
			}
		});
		
		console.log(chalk.cyan('vvvvvvv FILES TO BE PROCESSED vvvvvv'));

		files.forEach((file) => {
			console.log(chalk.blue(file));
			imagePathArr.push('/uploads/batch_src/' + request.payload.sourcePath + '/' + file);
		});

		const operationsIteratee = (imageInfo, cb) => {
			OperationsHandler.operationsHandler(imageInfo, request, cb);
		}
		// it iterates the collection and calls the iteratee passing each
		// item as first param to it. And waits until the iteratee resolves.
		async.eachSeries(imagePathArr, operationsIteratee, (err) => {
			if(err) return err;

			if (request.payload && request.payload.batch) {
				// removing all pasted files from source path
				files.forEach((filePath) => {
					fs.unlinkSync(sourcePath + '/' + filePath);
				});

				fs.unlinkSync(sourcePath + '/.done');
			}

			console.log(chalk.green(chalk.bold(chalk.magenta('✓') + " YAY !!!! YOU'RE ALL DONE :)")));
			cb(null, true);	
		});
	}

	if(fs.existsSync(sourcePath)) {
		// saving the configuration while processing multiple files from UI
		if (request.payload && request.payload.batch) {
			console.log(chalk.magenta('----------PROCESSING INITIATED AUTOMATICALLY DUE TO FOLDER UPDATE----------'));			
			multipleProcessor();
		}
		else {
			console.log(chalk.magenta('----------PROCESSING INITIATED BY USER MANUALLY----------'));			
			SaveConfig.saveConfig(request, (err, result) => {
				if (err) return err;

				multipleProcessor();
			});
		}
	}
}

module.exports = {
	multipleUploadsHandler: multipleUploadsHandler
}
