'use strict';

import OperationsHandler from './operationsHandler.js';
import chalk from 'chalk';

const requestHandler = (request, reply) => {
	console.log(chalk.yellow('---------- SINGLE IMAGE PROCESSING INITIATED ----------'));
	let imageInfo = request.payload && request.payload.imagePath;

	var userConfigurations = request.payload;
	
	OperationsHandler.operationsHandler(imageInfo, request, (err) => {
		if (err) return err;

		reply(true);
	});
}

module.exports = {
	requestHandler: requestHandler
}
