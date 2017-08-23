'use strict';

import hapi from 'hapi';
import routes from './routes';
import vision from 'vision';

// Instatiating hapi server
const server = new hapi.Server();

// Initiating connection on port
server.connection({
	port: process.env.port || 8000,
	host: "localhost"
});

server.register([vision], (err) => {
    if (err) {
       console.log("Failed to load vision.");
    }
});

// setting up templating engine
server.views({  
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    partialsPath: 'views/partials',
    helpersPath: 'views/helpers'
});

// handling routes
server.route(routes);

// starting server
server.start(() => {console.log("Server running at port", 8000)});