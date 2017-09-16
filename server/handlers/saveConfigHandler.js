'use strict';

import jwt from 'jsonwebtoken';
import SaveConfig from './saveConfig.js';
import chalk from 'chalk';

const saveConfigHandler = (request, reply) => {
    console.log('----------SAVING OPERATION INITIATED BY USER MANUALLY----------');
    const token = request.state && request.state.token;

    jwt.verify(token,process.env.SECRET_KEY,function(err,data) {
        if (err) return err;

        request.payload.data = data;

        SaveConfig.saveConfig(request, (err, result) => {
            if (err) return err;

            reply('successfully saved');
        });
    });
}

module.exports = {
    saveConfigHandler:saveConfigHandler
};