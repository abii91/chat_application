'use strict';

var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );
var io = socket.listen( server );


var socketstorage = {};
var users = {};



/**
 * Search array key from value
 * 
 * @param  {Array} arr [Array]
 * @param  {String} val [Array Value to search]
 * @return {[Number]}
 */
function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)
            return i;
    return false;
}


/*
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

*/

/**
 * Get the key by value
 * 
 * @param  {String} value [Value]
 * @return {Number}       [Key]
 */
Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
};


// Start connection
io.sockets.on( 'connection', function( client ) {
	console.log('new connection');

    /**
     * Store socket ID with user ID for the online users
     * 
     * @param  {Object} data
     * @return {Null}
     */
	client.on( 'socket id', function(data){
        try{
            console.log( "New User : " + data.user  +" : "+ client.id);
            socketstorage[data.user] = client.id;
            users[data.user] = data.user;
            io.sockets.emit('update ol users', {users: users} );
        } catch(err){
            err = new Error('The data passed is not recognized');
            throw err;
        }

	});


    /**
     * Process disconnect when the user lost
     * 
     * @param  {Object} data
     * @return {Null}
     */
  	client.on('disconnect', function(data) {
        try{
            var i = client.id;
            var disconnected_user = socketstorage.getKeyByValue( i );
            console.log('user disconnected: '+disconnected_user+' = '+i);
            delete users[disconnected_user];
            io.sockets.emit('disconnect user', {user: disconnected_user} );
        } catch(err){
            err = new Error('The user disconnected is not recognized');
            throw err;
        }
		
    });


    /**
     * Send message to the users involve in the conversation
     * 
     * @param  {Object} data
     * @return {Null}
     */
    client.on('send-message', function(data) {
        try{
            var emit_users = data.emit_to;
            var users_count = emit_users.length;

            for (var i = 0; i < users_count; i++) {
                var socketid = socketstorage[emit_users[i]];
                if(socketid!= undefined && data.emit_from != emit_users[i]){
                    console.log('Send message to user: '+emit_users[i]+', socket id: '+ socketid);
                    io.to(socketid).emit('recieved-message', {emit_from: data.emit_from, emit_to: emit_users[i], message_id: data.message_id, ci: data.ci} );
                }
                
            }
        } catch(err){
            err = new Error('An error occurred while emitting the data');
            throw err;
        }
    });


    /**
     * Group conversation option changes
     * It will emit to the users involve in the group conversation
     * 
     * @param  {Object} data
     * @return {Null}
     */
    client.on('update-group-conversation', function(data) {
        try{
            var emit_users = data.emit_to;
            var users_count = emit_users.length;

            for (var i = 0; i < users_count; i++) {
                var socketid = socketstorage[emit_users[i].user_id];
                if(socketid!= undefined && data.emit_from != emit_users[i].user_id){
                    console.log('Update Group Conversation: '+emit_users[i].user_id+', socket id: '+ socketid);
                    io.to(socketid).emit('update-group-conversation', {emit_from: data.emit_from, emit_to: emit_users[i].user_id, cn_id: data.cn_id} );
                }
                
            }

        } catch(err){
            err = new Error('An error occurred while emitting the data');
            throw err;
        }
    });
    
});

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  //process.exit(1);
});


server.listen( 10000 );