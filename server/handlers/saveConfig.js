'use strict';

import chalk from 'chalk';
import fs from 'fs';
import uuid from 'uuid/v1';
import userJSON from '../../user.json';

const deepDiff = require('deep-diff');

const saveConfig = (request, cb) => {
    let userID = request.payload && request.payload.data;
    let validUser = userJSON.users.filter((user) => {
        return userID === user.id;
    });
    let sourcePath = '/uploads/batch_src/' + request.payload && request.payload.sourcePath;
    let folderName = request.payload && request.payload.sourcePath;

    request.payload.folderName = folderName;
    request.payload.sourcePath = sourcePath;
    if (validUser.length == 1) {
      let isUniqueConfig = true;
      let diffConfig;
      if (validUser[0].config && validUser[0].config.length) {
        validUser[0].config.forEach(function(eachConfig) {
          let eachConfigId = eachConfig.configID;
          delete eachConfig.configID;
          diffConfig = deepDiff(request.payload, eachConfig);
          eachConfig.configID = eachConfigId;
          isUniqueConfig= (diffConfig)?  true : false;
        });
      }
      if(isUniqueConfig) {
        request.payload.configID = folderName + uuid();
        validUser[0].config.push(request.payload);

        fs.writeFileSync('user.json', JSON.stringify(userJSON));

        console.log(chalk.green('✓') + chalk.green(' ********** CONFIGURATIONS SAVED SUCCESSFULLY **********'));

        cb(null, request.payload);
      } else {
        console.log(chalk.green('x') + chalk.green(' ********** CONFIGURATION ALREADY EXISTS **********'));
        cb(null, false);
      }
    }
}

module.exports = {
	saveConfig: saveConfig
}
