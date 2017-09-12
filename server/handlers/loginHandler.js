'use strict';
var fs          = require('fs');
var jwt         = require('jsonwebtoken');
var users     = loadUsers();

process.env.SECRET_KEY = 'hafha2F3RT3ET2FYGFKJhishgjueiuF5n5095202nfhas983rhb';


// validate a user login
function validateUser(request, reply) {
    var userName = request.payload.userName;
    var userPassword = request.payload.password;

    // get user details form database(json)
    var dbUserName = users[userName].id;
    var dbPassword = users[userName].password;

    // check if exists
    if(!dbUserName){
        var errMsg = 'User not found';
        reply.view('login',{errMsg:errMsg});
    }

    else {
        // validate the user
            if(!(userName === dbUserName && userPassword === dbPassword)){
                var errMsg = 'Wrong username or password!';
                reply.view('login',{errMsg:errMsg});
            }

            else {
                var userId = users[userName].id;
                // if user is found and password is right
                // create a token
                var token = jwt.sign(userId, process.env.SECRET_KEY);
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
    validateUser:validateUser
};
