var io = require('socket.io').listen(8080);

io.on('connection', function(client){
  console.log("socket connected");
  client.on('messageSend', function(data){
    console.log("socket messageSend");

    io.emit("messageRec", data);
  });
  client.on('disconnect', function(){
    console.log("socket disconnect");

  });
});
