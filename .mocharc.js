//@ts-check
'use strict';

// https://mochajs.org/#command-line-usage

const NODE_ENV = process.env.NODE_ENV; // 'production' | 'ci' | 'test' | 'debug'

/**@type {import('mocha').MochaOptions}*/
module.exports = {
	'ignore-leaks': false,
	'allow-uncaught': true,
	'globals': [
		'window'
	],
	'require': [
		'source-map-support/register',
	],
	'timeout': 50000,
	'file': NODE_ENV === 'debug'
		? []
		: [
			'./tests/require/wtfnode.js'
		],
};
