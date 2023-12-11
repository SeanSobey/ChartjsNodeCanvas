const { fork } = require ( 'node:child_process' );
const converter = require ( './converter' );
const path = require ( 'node:path' );

class ChartJSNodeCanvas {

    #processInstance;
    #ready;

    constructor ( options ) {
        this.#processInstance = fork ( path.resolve( __dirname, 'process.js' ) );
        this.#ready = new Promise ( ( resolve, reject ) => {
            this.#processInstance.once ( 'exit', c => {
                console.log ( `child process exited with code ${ c }` );
                reject ();
            } );
            this.#processInstance.once ( 'error', e => {
                console.error ( 'child process errored', e.message );
                reject ( e );
            } );
            this.#processInstance.once ( 'message', () => {
                resolve ();
            } );
            this.#processInstance.send ( {
                command: 'constructor',
                args   : [ converter.fn2string( options ) ]
            } );
        } );
    }

    /**
     * @see {@link https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/src/index.ts#L110}
     */
    async renderToDataURL ( configuration, mimeType = 'image/png' ) {
        return new Promise ( ( resolve, reject ) => {
            this.#ready.then ( () => {
                this.#processInstance.once ( 'message', r => resolve ( r ) );
                this.#processInstance.send ( {
                    command: 'renderToDataURL',
                    args   : [ converter.fn2string( configuration ), mimeType ]
                } );
            } ).catch ( e => reject ( e ) );
        } );
    }

    /**
     * @see {@link https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/src/index.ts#L154}
     */
    async renderToBuffer ( configuration, mimeType = 'image/png' ) {
        return new Promise ( ( resolve, reject ) => {
            this.#ready.then ( () => {
                this.#processInstance.once ( 'message', r => resolve ( Buffer.from( r ) ) );
                this.#processInstance.send ( {
                    command: 'renderToBuffer',
                    args   : [ converter.fn2string( configuration ), mimeType ]
                } );
            } ).catch ( e => reject ( e ) );
        } );
    }

    /**
     * @see {@link https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/src/index.ts#L226}
     */
    async registerFont ( path, options ) {
        return new Promise ( ( resolve, reject ) => {
            this.#ready.then ( () => {
                this.#processInstance.once ( 'message', r => resolve ( r ) );
                this.#processInstance.send ( {
                    command: 'registerFont',
                    args   : [ path, options ]
                } );
            } ).catch ( e => reject ( e ) );
        } );
    }

};

module.exports = { ChartJSNodeCanvas };