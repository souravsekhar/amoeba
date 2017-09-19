'use strict';

import hapi from 'hapi';
import routes from './routes';
import vision from 'vision';
import chalk from 'chalk';
import inert from 'inert';
import MasterDirWatcher from './server/handlers/masterDirWatcher.js';
import ip from 'ip';

// Instatiating hapi server
const server = new hapi.Server();
// Initiating connection on port
server.connection({
	port: process.env.port || 3000,
	host: ip.address()
});

server.register([vision, inert], (err) => {
    if (err) {
       console.log("Failed to register.", err);
    }
});

// register the cookie scheme.
server.state('token', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

// setting up templating engine
server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'server/views',
    partialsPath: 'server/views/partials',
    helpersPath: 'server/views/helpers'
});

// handling routes
server.route(routes);

// starting server
server.start(() => {
    console.log(chalk.green('✓'), "Server running at port", ip.address(), ':', process.env.port);
    MasterDirWatcher.masterDirWatcher();
});
