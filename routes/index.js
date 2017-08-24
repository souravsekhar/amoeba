'use strict';

import UploadHandler from '../server/handlers/uploadHandler.js';

const routes = [  
{
	method: 'POST',
	path: '/upload',
	handler: function(request, reply) {        
        reply.view('upload', {data});
    }
},
{
    method: 'GET',
    path: '/show',
    handler: function(request, reply) {
        // Render the view with the custom greeting    
        reply.view('show', {});
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
