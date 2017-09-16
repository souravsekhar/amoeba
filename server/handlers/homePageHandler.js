'use strict';

import loginHandler from './loginHandler';
import chalk from 'chalk';

const jwt = require('jsonwebtoken'),
      users = loginHandler.loadUsers();


function homePageHandler (request, reply) {
    //get token from cookies
    const token = request.state.token;

    jwt.verify(token,process.env.SECRET_KEY,function(err,data) {
        if(err){
            reply("401").code(401);
        }else {
            let userId = data;



            reply.view('index',{userId:userId});
        }
    });
}

module.exports = {
    homePageHandler:homePageHandler
};
