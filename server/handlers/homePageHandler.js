const jwt         = require('jsonwebtoken');
import loginHandler from './loginHandler';

const users = loginHandler.loadUsers();

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
