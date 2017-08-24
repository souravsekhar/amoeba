'use strict';

const routes = [  
{
	method: 'GET',
	path: '/index',
	handler: function(request, reply) {
        // Render the view with the custom greeting
        var data = {
        	title: 'This is Index!',
        	message: 'Hello, World. You crazy handlebars layout',
        	user: {
        		role: 'user'
        	}
        };

        reply.view('layout', {data});
    }
},
{  
	method: 'GET',
	path: '/css/{file*}',
	handler: {
        directory: {
            path: 'public/lib/css',
            listing: true
        }
	}
}
];

module.exports = routes;
