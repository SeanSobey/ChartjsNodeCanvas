//@ts-check
'use-strict';

const path = require('path');

module.exports = exports = {
	'.ts': (destFilePath) => [
		changeFileExtension(destFilePath, '.d.ts'),
		changeFileExtension(destFilePath, '.js'),
		changeFileExtension(destFilePath, '.js.map'),
	]
};

/**
 * @param {string} filePath
 * @param {string} extension
 * @returns {string}
 */
function changeFileExtension(filePath, extension) {

	const pathObj = path.parse(filePath);
	const newPathObj = Object.assign({}, pathObj, { ext: extension, base: pathObj.name + extension });
	return path.format(newPathObj).replace(/\\/g, '/');
}
