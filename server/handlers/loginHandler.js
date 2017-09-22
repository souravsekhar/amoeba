'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const usersJSON = loadUsers();
import chalk from 'chalk';

process.env.SECRET_KEY = 'hafha2F3RT3ET2FYGFKJhishgjueiuF5n5095202nfhas983rhb';


// validate a user login
function validateUser(request, reply) {
    let userName = (request.payload.userName)+"@lowes.com",
        userPassword = request.payload.password,
        userNameExists,
        passwordExists;

    usersJSON.users.forEach((user) => {
        if (userName === user.id) {
            userNameExists = true;
            if (userPassword === user.password) {
                passwordExists = true;
                let userId = user.id;
                let token = jwt.sign(userId, process.env.SECRET_KEY);

                reply.redirect('/home').state('token', token);
            }
        }
    });

    if (!userNameExists) {
        let errMsg = 'User not found';
        reply.view('login',{errMsg:errMsg});
    }
    else if(!passwordExists){
        let errMsg = 'Wrong password!';
        reply.view('login',{errMsg:errMsg});
    }
}

// load notes from database
function loadUsers() {
    var data = fs.readFileSync('user.json','utf8');
    return JSON.parse(data.toString());
}

module.exports = {
    validateUser:validateUser,
    loadUsers:loadUsers
};
