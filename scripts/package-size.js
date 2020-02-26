//@ts-check
'use-strict';

// const yargs = require('yargs');
const { exec } = require('child_process');
const { EOL } = require('os');
const { promisify } = require('util');

const execAsync = promisify(exec);

// const argv = yargs.options({})
// 	.strict()
// 	.config()
// 	.argv;

async function main() {

	const maxIncreaseDelta = 0.05;
	const packageInfo = require('../package.json');
	const package = await dryRunPack();
	const publishedPackage = await dryRunPack(packageInfo.name);
	const increaseDelta = (package.size - publishedPackage.size) / publishedPackage.size;
	if (increaseDelta > maxIncreaseDelta) {
		const packageContents = package.files.map(file => file.path);
		throw new Error(`Package increased in size by ${Math.round(increaseDelta * 100)}%, (${package.size - publishedPackage.size} bytes)${EOL}== Tarball Contents ===${EOL}${packageContents.join(EOL)}`);
	}
	console.log('Package size is within delta threshold', { publishedPackageSize: publishedPackage.size, packageSize: package.size, increaseDelta });
}

/**
 * @param {string} name
 * @param {string} version
 * @returns {Promise<object>}
 */
async function dryRunPack(name = null, version = null) {

	// https://docs.npmjs.com/cli-commands/pack.html
	const package = name
		? `${name}@${version || 'latest'}`
		: '';
	const { stderr, stdout } = await execAsync(`npm pack ${package} --dry-run --json`);
	try {
		const data = JSON.parse(stdout);
		if (!data || !Array.isArray(data)) {
			throw new Error(`Bad json data: ${EOL}${data}${EOL}json: ${EOL}${stdout}`);
		}
		if (data.length !== 1) {
			throw new Error(`Bad array data: ${EOL}${data}${EOL}`);
		}
		return data[0];
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`Failed to parse json with error: ${EOL}${error}${EOL}json: ${EOL}${stdout}`)
		}
		throw error;
	}
}

main()
	.catch((error) => console.error(error));
