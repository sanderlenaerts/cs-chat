
// holds available staff
var staff = {}

// holds all clients waiting
var queue = [];

// holds the who to who
var staffInChat = {

};


module.exports = function(io) {

  io.sockets.on('connection', function(socket){

    socket.emit('connect', {});

    //TODO: register the user in a list of either clients or staff
    socket.on('data', function(user){
      console.log(user);

      if (user.username == '' || user.name == ''){
        // this means it is client/customer

        // Push it to the queue
        queue.push(socket.id);
      }
      else {
        var client = new Object();
        client.name = user.name;

        //Save the data about staff member to object literal
        staff[socket.id] = client;
      }
    })

    // Accept a new customer
    socket.on('accept', function(data){
      var obj = new Object();

      // Get the socket id from the first person in the queue and remove it
      obj.partner = queue.shift();
      obj.name = staff[socket.id].name;
      staffIChat[socket.id] = obj;


      // Adding object to object literal of clients in chat
      var client = new Object();
      client.partner = socket.id;
      clientsInChat[obj.partner] = client;

      //Remove staff member from available staff
      if (staff.hasOwnProperty(socket.id)){
        // delete it from the available staff
        delete staff[socket.id];
      }
    })

    // When closing the browser
    socket.on('disconnect', function(data){
      // if client, remove from queue, or stop the chat
      // When stopping the chat, put staff member back to available staff


      // if staff, remove from chat or available staff

    })

    socket.on('stop-chat', function(data){
      // When manually stopping the chat
      // Same when someone disconnects

      deleteConversationTraces();

    })

    var deleteConversationTraces = function(){
      //Check if it's a client
      if (clientsInChat.hasOwnProperty(socket.id)){
        // it's a client
        var staffId = clientsInChat[socket.id].partner;

        delete clientsInChat[socket.id];
        delete staffInChat[staffId];
      }
      else {
        if (staffInChat.hasOwnProperty(socket.id)){
          // it's a staff member
          var clientId = staffInChat[socket.id].partner;

          delete clientsInChat[clientId];
          delete staffInChat[socket.id];
        }
      }
    }

    //Leaving the queue
    socket.on('stopQueue', function(data){
      var index = queue.indexOf(socket.id);
      if (index > -1) {
        queue.splice(index, 1);
      }
    })


    socket.on('add-message', function(message){
      console.log('test');

      var partner = findPartner();

      if (io.sockets.connected[partner]) {
        io.sockets.connected[partner].emit('message',{type:'new-message', text: message});
      }

    })

    var findPartner = function(){
      if (clientsInChat.hasOwnProperty(socket.id)){
        return clientsInChat[socket.id].partner;
      }
      else {
        if (staffInChat.hasOwnProperty(socket.id)){
          return staffInChat[socket.id].partner;
        }
      }
    }

    socket.on('disconnect', function (data) {

    })
  });
}
