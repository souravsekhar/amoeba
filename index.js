'use strict';

import hapi from 'hapi';

// Instatiating hapi server
const server = new hapi.server();

// Initiating connection on port
server.connection({
	port: process.env.port || 8000
});