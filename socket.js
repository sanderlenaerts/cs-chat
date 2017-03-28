
// holds available staff
var staff = {}

var availableStaff = {}

// holds all clients waiting
var queue = [];

// holds the who to who
var staffInChat = {}

var clientsInChat = {}

var customerId = 1;

module.exports = function(io) {
  io.sockets.on('connection', function(socket){
    console.log('Connecting ' + socket.id);

    socket.emit('connect', {});

    //TODO: register the user in a list of either clients or staff
    socket.on('data', function(user){
      console.log(user);

      if (user.username == '' || user.name == ''){
        // this means it is client/customer

        // Push it to the queue
        queue.push(socket.id);
        console.log(queue);

        updateQueueAmount();

      }
      else {
        var client = new Object();
        client.name = user.name;

        //Save the data about staff member to object literal
        staff[socket.id] = client;

        //Emit how many people are in the queue
        if (io.sockets.connected[socket.id]) {
          io.sockets.connected[socket.id].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
    })

    var updateQueueAmount = function(){
      // let the staff know the queue length
      for (var key in staff) {
        if (io.sockets.connected[key]) {
          io.sockets.connected[key].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
      // Let the staff who are in chat know the queue length
      for (var key in staffInChat){
        if (io.sockets.connected[key]) {
          io.sockets.connected[key].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
    }

    // Accept a new customer
    socket.on('match-customer', function(data){

      console.log('Trying to match customer to staff');
      var obj = new Object();

      if (queue.length > 0){

        // Get the socket id from the first person in the queue and remove it
        obj.partner = queue.shift();

        console.log('staff: ', staff);
        // Add the socket id to the partner property of a staff member in chat
        obj.name = staff[socket.id].name;
        staffInChat[socket.id] = obj;


        // Adding object to object literal of clients in chat
        var client = new Object();
        client.partner = socket.id;
        client.name = "Customer" + customerId;
        clientsInChat[obj.partner] = client;

        console.log("Clients in chat: ", clientsInChat);
        console.log("Staff in chat: ", staffInChat);

        //Remove staff member from available staff
        if (staff.hasOwnProperty(socket.id)){
          // delete it from the available staff
          delete staff[socket.id];
        }


        // Send a "start chatting" message to everyone
        if (io.sockets.connected[socket.id]) {
          io.sockets.connected[socket.id].emit('match-complete', {type: 'start', chattingWith: client.name });
        }
        if (io.sockets.connected[obj.partner]){
          io.sockets.connected[obj.partner].emit('match-complete', {type: 'start', chattingWith: obj.name});
        }

        updateQueueAmount();

      }
    })

    var clientInQueue = function() {
      return queue.indexOf(socket.id) > -1;
    }

    // When closing the browser
    socket.on('disconnect', function(data){
      console.log('Disconnecting ' + socket.id);
      // if client, remove from queue, or stop the chat
      // When stopping the chat, put staff member back to available staff
      if (isClient()){
        if (clientInQueue()){
          removeFromQueue();
          updateQueueAmount();
        }
        else {
          // If not in queue, client's in chat
          stopConversationByClient();
        }
      }
      else if (isStaff()){
        if (isStaffAvailable()){
          removeAvailableStaff();
        }
        else if (isStaffInChat()) {
          // he could be chatting with someone
          stopConversationByStaff();
        }
        else {
          // if he is not marked as available and he is not chatting with someone he is just connected
          removeStaff();
        }
      }
      else {
        // error, this scenario should not be possible
      }
    })

    var removeAvailableStaff = function(){
      delete availableStaff[socket.id];
    }

    var removeStaff = function(){
      delete staff[socket.id];
    }

    var isClient = function(){
      return (clientsInChat.hasOwnProperty(socket.id) || (queue.indexOf(socket.id) > -1));
    }

    var isStaff = function(){
      return (staffInChat.hasOwnProperty(socket.id) || staff.hasOwnProperty(socket.id));
    }

    var isStaffAvailable = function(){
      return availableStaff.hasOwnProperty(socket.id);
    }

    var isStaffInChat = function(){
      return staffInChat.hasOwnProperty(socket.id);
    }

    socket.on('stop-chat', function(data){
      // When manually stopping the chat
      deleteConversationTraces();
    })

    var stopConversationByClient = function(){
      var staffId = clientsInChat[socket.id].partner;
      delete clientsInChat[socket.id];

      // Need to put staff back to avaiable staff members before deleting
      var obj = staffInChat[staffId];
      staff[staffId] = obj;

      // Now we can safely delete it from the the staff in chat object
      delete staffInChat[staffId];

      endConversation(staffId);
      updateQueueAmount();
    }

    var stopConversationByStaff = function(){
      console.log("Staff member is stopping the conversation");
      var clientId = staffInChat[socket.id].partner;

      var obj = new Object();
      obj.name = staffInChat[socket.id].name;

      console.log("clientsInChat before delete: ", clientsInChat);
      console.log("staffInChat before delete: ", staffInChat);


      delete clientsInChat[clientId];

      console.log("clientsInChat after delete: ", clientsInChat);
      delete staffInChat[socket.id];

      console.log("staffInChat after delete: ", staffInChat);

      console.log("staff: ", staff);
      console.log("queue: ", queue);

      staff[socket.id] = obj;

      console.log("staff after: ", staff);

      endConversation(clientId);
      updateQueueAmount();
    }

    var deleteConversationTraces = function(){
      //Check if it's a client
      if (clientsInChat.hasOwnProperty(socket.id)){
        // it's a client
        stopConversationByClient();
      }
      else {
        if (staffInChat.hasOwnProperty(socket.id)){
          stopConversationByStaff();
        }
      }
    }

    var endConversation = function(id){
      if (io.sockets.connected[id]) {
        io.sockets.connected[id].emit('endConversation',{type: 'endConversation'});
      }
    }

    var removeFromQueue = function(){
      var index = queue.indexOf(socket.id);
      if (index > -1) {
        queue.splice(index, 1);
      }
    }

    //Leaving the queue
    socket.on('stopQueue', function(data){
      removeFromQueue();
      updateQueueAmount();
    })

    // Make staff member available
    socket.on('markAvailable', function(data){
      var staffMember = staff[socket.id];

      // Set the staff member in the available literal
      availableStaff[socket.id] = staffMember;

      // Delete from staff
      delete staff[socket.id];
    })

    socket.on('markUnavailable', function(data){
      var staffMember = availableStaff[socket.id];

      staff[socket.id] = staffMember;

      delete availableStaff[socket.id];
    })


    socket.on('add-message', function(message){
      console.log('test');
      var partner = findPartner();

      var name = findName();
      console.log("From: ", name);

      if (io.sockets.connected[partner]) {
        io.sockets.connected[partner].emit('message',{type:'new-message', text: message, from: name});
        io.sockets.connected[socket.id].emit('message', {type: 'new-message', text: message, from: name});
      }
    })

    var findName = function(){
      if (clientsInChat.hasOwnProperty(socket.id)){
        return clientsInChat[socket.id].name;
      }
      else {
        if (staffInChat.hasOwnProperty(socket.id)){
          return staffInChat[socket.id].name;
        }
      }
    }

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

  });
}
