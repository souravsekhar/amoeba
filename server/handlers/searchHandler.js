'use strict';

import fs from 'fs';
import chalk from 'chalk';

const searchHandler = (request, reply) => {		
	let fileNamesArr = fs.readdirSync('./uploads/originals');
	let searchText = request.query.searchText;
	
	const nameSearched = fileNamesArr.filter((name) => {		
		if (name.substring(0, searchText.length) === searchText) {
			return name;
		}
	});	
	reply(nameSearched);
}

module.exports = {
	searchHandler: searchHandler
}