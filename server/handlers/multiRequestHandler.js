'use strict';

import MultipleUploadsHandler from './multipleUploadsHandler.js';
import jwt from 'jsonwebtoken';

const multiRequestHandler = (request, reply) => {
	let token = request.state && request.state.token;

	jwt.verify(token,process.env.SECRET_KEY,function(err,data) {
		request.payload.data = data;

		MultipleUploadsHandler.multipleUploadsHandler(request, (err, result) => {
			if (err) return err;

			reply('Multiple processing done');
		});
	});
}

module.exports = {
	multiRequestHandler: multiRequestHandler
}