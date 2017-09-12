

function homePageHandler (request, reply) {
    reply.view('index');
}



module.exports = {
    homePageHandler:homePageHandler
};
