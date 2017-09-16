'use strict';

import chalk from 'chalk';
import usersJSON from '../../user.json';
import MultipleUploadsHandler from './multipleUploadsHandler.js';

const childDirWatcher = (path) => {
	let arr = path.split('/');
	let changedFolder = arr[arr.length - 2];
	let validConfig = {};

 	usersJSON.users.forEach((user) => {
 		user.config.forEach((settings) => {
 			if (settings.folderName === changedFolder) {
 				validConfig.payload = settings;
 			}
 		});
 	});
 
    validConfig.payload.batch = true;

    console.log(chalk.yellow('PROCESSING STARTED . . .'))
    MultipleUploadsHandler.multipleUploadsHandler(validConfig, (err) => {
    	if (err) return err;
    	console.log('DONE');
    });
}

module.exports = {
	childDirWatcher: childDirWatcher
}