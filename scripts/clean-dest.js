//@ts-check
'use-strict';

const path = require('path');

module.exports = exports = {
	'.ts': (destFilePath) => {
		const dirname = path.dirname(destFilePath);
		const basename = path.basename(destFilePath, path.extname(destFilePath));
		return [
			path.posix.join(dirname, basename + '.d.ts'),
			path.posix.join(dirname, basename + '.js'),
			path.posix.join(dirname, basename + '.js.map'),
		]
	}
};
