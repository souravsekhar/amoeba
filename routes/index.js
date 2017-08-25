'use strict';

import UploadHandler from '../server/handlers/uploadHandler.js';

const routes = [
    {// homepage of the app
    	method: 'GET',
    	path: '/upload',
    	handler: function (request, reply) {
            reply.view('upload', {});
        }
    },
    {// show processed images
        method: 'GET',
        path: '/show',
        handler: function(request, reply) {
            reply.view('show', {});
        }
    },
    {// upload images
        method: 'POST',
        path: '/image/upload',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: false,
                allow: 'multipart/form-data'
            }
        },
        handler: UploadHandler.uploadHandler
    },
    {// serve css files
    	method: 'GET',
    	path: '/css/{file*}',
    	handler: {
            directory: {
                path: 'public/lib/css',
                listing: true
            }
    	}
    },
    {// serve js files
        method: 'GET',
        path: '/js/{file*}',
        handler: {
            directory: {
                path: 'public/lib/js',
                listing: true
            }
        }
    }
];

module.exports = routes;
