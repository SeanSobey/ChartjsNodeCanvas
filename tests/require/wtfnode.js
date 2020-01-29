const wtfnode = require('wtfnode');
const { after } = require('mocha');

after(() => {
	wtfnode.dump();
});
