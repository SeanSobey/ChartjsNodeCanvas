// https://github.com/hughsk/fresh-require

export const freshRequire: /*NodeJS.Require*/ (id: string) => any = (file) => {

	const resolvedFile = require.resolve(file);
	const temp = require.cache[resolvedFile];
	delete require.cache[resolvedFile];
	const modified = require(resolvedFile);
	require.cache[resolvedFile] = temp;
	return modified;
};
