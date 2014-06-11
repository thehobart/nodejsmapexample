var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//var app = module.exports = express.createServer();

// Configuration

app.use(express.static(__dirname + '/public'));


app.set('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.set('production', function(){
  app.use(express.errorHandler()); 
});


var port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";


//Socket.io
//var io = socket.listen(app);

//Needed for Heroku
//https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku

//io.set("transports", ["xhr-polling"]); 
//io.set("polling duration", 10); 


io.on('connection', function(socket){

  socket.on('add', function(message){
    console.log("ID: %s latitude = %d longitude = %d", socket.id,  message.latitude, message.longitude);
    io.sockets.emit("add", {'id': socket.id,  'latitude': message.latitude, 'longitude': message.longitude});
  });
		
	//Remove client from Google Map 
	socket.on('disconnect', function(){
    io.sockets.emit("remove", {'id': socket.id});
	});
	 
});

server.listen(port, ipaddr, function() {
  console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
}); 

