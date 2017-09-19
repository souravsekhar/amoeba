'use strict';

import UploadHandler from '../server/handlers/uploadHandler.js';
import SearchHandler from '../server/handlers/searchHandler.js';
import ImageUploadHandler from '../server/handlers/imageUploadHandler.js';
import RequestHandler from '../server/handlers/requestHandler.js';
import MultiRequestHandler from '../server/handlers/multiRequestHandler.js';
import loginHandler from '../server/handlers/loginHandler.js';
import homePageHandler from '../server/handlers/homePageHandler.js';
import SaveConfigHandler from '../server/handlers/SaveConfigHandler.js';

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
    {// serve js files
        method: 'GET',
        path: '/fonts/{file*}',
        handler: {
            directory: {
                path: 'public/lib/fonts',
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
    {// upload images
        method: 'POST',
        path: '/image/multipleUpload',
        handler: MultiRequestHandler.multiRequestHandler
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
            reply.view('login');
        }
    },
    {// login handler
        method: 'POST',
        path: '/login',
        handler: loginHandler.validateUser
    },
    {// logout handler
        method: 'GET',
        path: '/logout',
        handler: function (request, reply) {
            reply.redirect('/').unstate('token');
        }
    },


    {// home handler
        method: 'GET',
        path: '/home',
        handler: homePageHandler.homePageHandler
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
    },
    {
        method: "POST",
        path: '/image/process',
        handler: RequestHandler.requestHandler
    },
    {
        method: "POST",
        path: '/saveConfig',
        handler: SaveConfigHandler.saveConfigHandler
    }
];

module.exports = routes;
