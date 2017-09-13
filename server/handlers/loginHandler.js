'use strict';
const fs          = require('fs');
const jwt         = require('jsonwebtoken');
const users     = loadUsers();

process.env.SECRET_KEY = 'hafha2F3RT3ET2FYGFKJhishgjueiuF5n5095202nfhas983rhb';


// validate a user login
function validateUser(request, reply) {
    let userName = request.payload.userName;
    let userPassword = request.payload.password;

    // check if exists
    if(!(userName in users)){
        var errMsg = 'User not found';
        reply.view('login',{errMsg:errMsg});
    }

    else {
        // get user details form database(json)
        let dbUserName = users[userName].id;
        let dbPassword = users[userName].password;

        // validate the user
            if(!(userPassword === dbPassword)){
                var errMsg = 'Wrong username or password!';
                reply.view('login',{errMsg:errMsg});
            }

            else {
                let userId = users[userName].id;
                // if user is found and password is right
                // create a token
                let token = jwt.sign(userId, process.env.SECRET_KEY);
                //  console.log("token generated:  "+token);
                // save this tokent on client side
                reply.redirect('/home').state('token', token);
            }
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
