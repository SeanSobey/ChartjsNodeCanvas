const { ChartJSNodeCanvas } = require ( '../dist/index' );
const converter = require ( './converter' );

let instance;

process.on ( 'message', async msg => {

    switch ( msg.command ) {

        case 'constructor':
            instance = new ChartJSNodeCanvas ( converter.string2fn ( msg.args[ 0 ] ) );
            process.send ( 'constructor initialised' );
            break;

        case 'renderToDataURL':
            const url = await instance.renderToDataURL ( converter.string2fn ( msg.args[ 0 ] ) );
            process.send ( url );
            break;

        case 'renderToBuffer':
            const buffer = await instance.renderToBuffer ( converter.string2fn ( msg.args[ 0 ] ) );
            process.send ( buffer );
            break;

        case 'renderToStream':
            //todo: https://github.com/MetaMask/post-message-stream
            process.send ( 'TODO' );
            break;

        case 'registerFont':
            instance._registerFont ( msg.args[ 0 ], msg.args[ 1 ] );
            process.send ( 'font registered' );
            break;

    }

} );