'use strict';

import OperationsHandler from './operationsHandler.js';

const requestHandler = (request, reply) => {
	let imageInfo = request.payload && request.payload.imagePath;

	var userConfigurations = request.payload;
	console.log("userConfigurations",userConfigurations);

	OperationsHandler.operationsHandler(imageInfo, request, (err) => {
		if (err) return err;
	});
}

module.exports = {
	requestHandler: requestHandler
}
