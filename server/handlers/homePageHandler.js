'use strict';

import loginHandler from './loginHandler';
import chalk from 'chalk';
import userJSON from '../../user.json';

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
            let context = {};
            let savedConfigs = [];
            let orderedSavedConfig = [];
            let validUser = userJSON.users.filter((user) => {
                return userId === user.id;
            });

            if (validUser.length == 1) {
              if (validUser[0].config && validUser[0].config.length) {
                for(var i = (validUser[0].config.length - 1) ; (i >= 0 && savedConfigs.length < 4) ; i--){
                  savedConfigs.push(validUser[0].config[i]);
                }
              }
            }
            if (savedConfigs && savedConfigs.length) {
              savedConfigs.forEach((eachSavedConfig) => {
                  let orderedConfig = {};
                  orderedConfig.order = {}
                  let orderArray = JSON.parse(eachSavedConfig.operationOrder);
                  orderedConfig.folderName = eachSavedConfig.folderName;
                  orderedConfig.configID = eachSavedConfig.configID;
                  orderArray.forEach((operation) => {
                      let opern = operation.toLowerCase();
                      orderedConfig.order[opern] = eachSavedConfig[opern];
                  });
                  orderedSavedConfig.push(orderedConfig);
              });
            }

            context.userId = userId;
            context.savedConfigs = orderedSavedConfig;
            reply.view('index',context);
        }
    });
}

module.exports = {
    homePageHandler:homePageHandler
};
