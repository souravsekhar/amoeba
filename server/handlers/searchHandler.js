'use strict';

import fs from 'fs';

const searchHandler = (request, reply) => {		
	let fileNamesArr = fs.readdirSync('./uploads/originals');
	let searchText = request.query.searchText;
	console.log(fileNamesArr);	
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