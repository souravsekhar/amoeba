'use strict';

import MultipleUploadsHandler from './multipleUploadsHandler.js';
import jwt from 'jsonwebtoken';
import userJSON from '../../user.json';

const multiRequestHandler = (request, reply) => {
	let token = request.state && request.state.token;

	jwt.verify(token,process.env.SECRET_KEY,function(err,data) {
		if(request.payload.configId){
			let validUser = userJSON.users.filter((user) => {
                return data === user.id;
            });
            if (validUser.length == 1) {
              if (validUser[0].config && validUser[0].config.length) {
                validUser[0].config.forEach(function(config){
                	if(config.configID == request.payload.configId){
                		request.payload = config;
                		return false;
                	}
                })
              }
            }
		}
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