//@ts-check
'use strict';

// https://mochajs.org/#command-line-usage

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
  'file': [
	  './tests/require/wtfnode.js'
  ],
};
