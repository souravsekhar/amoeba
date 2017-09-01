'use strict';

import UploadHandler from '../server/handlers/uploadHandler.js';
import SearchHandler from '../server/handlers/searchHandler.js';
import ImageUploadHandler from '../server/handlers/imageUploadHandler.js'

const routes = [
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
    },
    {// serve bootstrap js files
        method: 'GET',
        path: '/bootstrap/js/{file*}',
        handler: {
            directory: {
                path: 'public/lib/bootstrap/js',
                listing: true
            }
        }
    },
    {// serve bootstrap css files
        method: 'GET',
        path: '/bootstrap/css/{file*}',
        handler: {
            directory: {
                path: 'public/lib/bootstrap/css',
                listing: true
            }
        }
    },
    {// serve bootstrap js files
        method: 'GET',
        path: '/bootstrap/fonts/{file*}',
        handler: {
            directory: {
                path: 'public/lib/bootstrap/fonts',
                listing: true
            }
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
    {// upload images
        method: 'POST',
        path: '/upload',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: false,
                allow: 'multipart/form-data'
            }
        },
        handler: ImageUploadHandler.imageUploadHandler
    },
    {// show processed images
        method: 'GET',
        path: '/search',
        handler: SearchHandler.searchHandler
    },
    {// homepage of the app
        method: 'GET',
        path: '/process',
        handler: function (request, reply) {            
            reply.view('process', {});
        }
    },
    {// homepage of the app
        method: 'GET',
        path: '/',
        handler: function (request, reply) {            
            reply.view('index', {});
        }
    },
   {// serve uploaded image files
        method: 'GET',
        path: '/uploads/originals/{file*}',
        handler: {
            directory: {
                path: 'uploads/originals',
                listing: true
            }
        }
    }
];

module.exports = routes;
