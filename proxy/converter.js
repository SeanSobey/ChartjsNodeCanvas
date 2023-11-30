
// Traverse nested objects and apply a callback function for non-objects
function _traverseObject ( o, callback ) {
    Object.keys ( o ).forEach ( function ( k ) {
        if ( o[ k ] !== null && typeof o[ k ] === 'object' ) {
            return _traverseObject ( o[ k ], callback );
        } else {
            o[ k ] = callback ( o[ k ] );
        }
    } );
    return o;
}

converter = {

    // Convert function to string
    // Function must not reference anything outside of the function scope!
    // Only local variables and arguments allowed otherwise it wont work
    fn2string: ( arg ) => {
        if ( typeof arg === 'object' ) {
            return _traverseObject ( arg, converter.fn2string );
        } else if ( typeof arg === 'function' ) {
            return '[#fn#]:' + arg.toString ();
        } else {
            return arg;
        }
    },

    // Convert string back to function
    string2fn: ( arg ) => {
        if ( typeof arg === 'object' ) {
            return _traverseObject ( arg, converter.string2fn );
        } else if ( typeof arg === 'string' && arg.indexOf( '[#fn#]:' ) === 0 ) {
            return new Function( "return " + arg.replace( '[#fn#]:', '' ) )();
        } else {
            return arg;
        }
    }

}

module.exports = converter;