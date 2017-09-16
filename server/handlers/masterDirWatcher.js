'use strict';

import chokidar from 'chokidar';
import path from 'path';
import chalk from 'chalk';
import ChildDirWatcher from './childDirWatcher.js';

const masterDirWatcher = () => {
	console.log(chalk.green('WATCHING MAIN DIRECTORY AT '), chalk.cyan(path.resolve(__dirname, '../../uploads/batch_src')));

	let watcher = chokidar.watch([path.resolve(__dirname, '../../uploads/batch_src')], {
	  persistent: true
	});	

	watcher.on('add', (path) => {

		let doneFile = path.substring(path.lastIndexOf('/') + 1);

		if (doneFile === '.done') {
			console.log(chalk.magenta('.done FILE DETECTED'));
			ChildDirWatcher.childDirWatcher(path);
		}
	});
}

module.exports = {
	masterDirWatcher: masterDirWatcher
}