'use strict';

import fs from 'fs';
import async from 'async';
import OperationsHandler from './operationsHandler.js';

const multipleUploadsHandler = (request, reply) => {
	let sourcePath = './uploads/batch_src',
		imagePathArr = [];

	let files = fs.readdirSync(sourcePath);

	files.splice(0, 2);
	console.log('file', files);

	files.forEach((file) => {
		imagePathArr.push('/uploads/batch_src/' + file);
	});
	
	const operationsIteratee = (imageInfo, cb) => {
		OperationsHandler.operationsHandler(imageInfo, request, cb);
	}

	// it iterates the collection and calls the iteratee passing each 
	// item as first param to it. And waits until the iteratee resolves.
	async.eachSeries(imagePathArr, operationsIteratee, (err) => {
		if(err) return err;
		// reply('series done');
	});
}

module.exports = {
	multipleUploadsHandler: multipleUploadsHandler
}