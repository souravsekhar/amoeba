'use strict';

import chalk from 'chalk';
import fs from 'fs';
import uuid from 'uuid/v1';
import userJSON from '../../user.json';

const saveConfig = (request, cb) => {
    let userID = request.payload && request.payload.data;       
    let validUser = userJSON.users.filter((user) => {
        return userID === user.id;
    });
    let sourcePath = '/uploads/batch_src/' + request.payload && request.payload.sourcePath;
    let folderName = request.payload && request.payload.sourcePath;

    request.payload.configID = folderName + uuid();
    request.payload.folderName = folderName;
    request.payload.sourcePath = sourcePath;

    if (validUser.length > 1) {
    	validUser[0].config.push(request.payload);
    }

    fs.writeFileSync('user.json', JSON.stringify(userJSON));

    console.log(chalk.green('✓') + chalk.green(' ********** CONFIGURATIONS SAVED SUCCESSFULLY **********'));

    cb(null, true);
}

module.exports = {
	saveConfig: saveConfig
}