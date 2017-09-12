'use strict';

import hapi from 'hapi';
import routes from './routes';
import vision from 'vision';
import chalk from 'chalk';
import inert from 'inert';

// Instatiating hapi server
const server = new hapi.Server();

// Initiating connection on port
server.connection({
	port: process.env.port || 8080,
	host: "localhost"
});

server.register([vision, inert], (err) => {
    if (err) {
       console.log("Failed to register.", err);
    }
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
server.start(() => {console.log(chalk.green('✓'), "Server running at port", 8000)});