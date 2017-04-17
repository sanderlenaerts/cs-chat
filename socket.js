
// holds available staff
var staff = {}

var availableStaff = {}

var clients = {};
// holds all clients waiting
var queue = [];

// holds the who to who
var staffInChat = {}

var clientsInChat = {}

var clientInformation = {}


module.exports = function(io) {
  io.sockets.on('connection', function(socket){
    console.log('Connecting ' + socket.id);

    socket.emit('connect', {});

    socket.on('register', function(data){
      console.log("Registering user: ", data);
      let uid;

      if (data.uid == null){
        uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
      }
      else {
        uid = data.uid;
      }

      if (data.type == "auth"){
        // logged in user
        console.log("Register logged in user");
        if (staff.hasOwnProperty(uid)){
          // update the socket id
          staff[uid].socket = socket.id;
          staff[uid].name = data.user.name;

          if (staffInChat.hasOwnProperty(uid)){
            socket.emit('continue', {
              type: 'continue',
              partner: clientInformation[staffInChat[uid].partnerId],
              chat: staffInChat[uid].chat,
              ticket: staffInChat[uid].ticket
            });

            staffInChat[uid].socket = socket.id;
            clientsInChat[staffInChat[uid].partnerId].partner = socket.id;
          }
        }
        else {
          var member = new Object();
          member.name = data.user.name;
          member.socket = socket.id;

          staff[uid] = member;


          console.log('Staff after register: ', staff);
        }

        // Immediately show the member how many users are in queue
        if (io.sockets.connected[socket.id]) {
          io.sockets.connected[socket.id].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
      
      else {
        console.log("Register customer");
        if (clientInformation.hasOwnProperty(uid)){
          clientInformation[uid].socket = socket.id;

          if(isClientInChat(uid)){
            clientsInChat[uid].socket = socket.id;
            staffInChat[clientsInChat[uid].partnerId].partner = socket.id;


          }
        }
        else {
          var client = new Object();
          client.name = '';
          client.description = '';
          client.email = '';
          client.ip = socket.handshake.address;
          client.socket = socket.id;

          clientInformation[uid] = client;
        }
      }

      socket.emit('identify', {
        uid: uid
      })
    })

    socket.on('isRegistered', function(data){
      let uid = data.uid;
      var registered = false;
      var inQueue = false;
      var active = false;
      var partner = {
        name: ''
      }

      var chat = [];

      if (clientInformation.hasOwnProperty(uid)){
        registered =  clientInformation[uid].description != ''
          && clientInformation[uid].name != ''
          && clientInformation[uid].email != ''
      }

      if(queue.indexOf(uid) >= 0){
        inQueue = true;
        updateCustomerQueuePosition();
      }

      if (isClientInChat(uid)){
        active = true;
        partner = staff[clientsInChat[uid].partnerId];
        chat = clientsInChat[uid].chat;

        console.log(chat);
      }

      socket.emit('isRegistered', {
        type: 'isRegistered',
        registered: registered,
        queue: inQueue,
        active: active,
        partner: partner,
        chat: chat
      })
    })

    socket.on('joinQueue', function(data){
      let uid = data.uid;

      queue.push(uid);

      updateStaffQueue();
      updateCustomerQueuePosition();
    })

    socket.on('leaveQueue', function(data){
      let uid = data.uid;
      removeFromQueue(uid);
    })

    var updateStaffQueue = function(){
      // let the staff know the queue length
      for (var key in staff) {
        
        if (io.sockets.connected[staff[key].socket]) {
          io.sockets.connected[staff[key].socket].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
      // Let the staff who are in chat know the queue length
      for (var key in staffInChat){
        if (io.sockets.connected[staffInChat[key].socket]) {
          io.sockets.connected[staffInChat[key].socket].emit('queue-length',{type:'queue-length', length: queue.length});
        }
      }
    }

    socket.on('save-ticket', function(data){
      let uid = data.uid;

      if (staffInChat.hasOwnProperty(uid)){
        staffInChat[uid].ticket = data.ticket;
      }
    })

    // Accept a new customer
    socket.on('match-customer', function(data){
      let uid = data.uid;

      console.log('Trying to match customer to staff');
      var obj = new Object();

      if (queue.length > 0){

        // Get the socket id from the first person in the queue and remove it
        let paired = queue.shift();
        obj.partner = clientInformation[paired].socket;
        obj.partnerId = paired;

        console.log('Staff member; ', staff[uid]);
        // Add the socket id to the partner property of a staff member in chat
        obj.name = staff[uid].name;
        obj.socket = staff[uid].socket;
        obj.chat = [];
        obj.ticket = {}
        staffInChat[uid] = obj;


        // Adding object to object literal of clients in chat

        var client = new Object();
        client.partner = staff[uid].socket;
        client.name = clientInformation[paired].name;
        client.socket = clientInformation[paired].socket;
        client.partnerId = uid;
        client.chat = [];

        clientsInChat[paired] = client;

        var clientInfo = clientInformation[paired];

        clientInfo.type = 'start';

        var newObj = {
          type: 'start',
          name: obj.name
        }

        // Send a "start chatting" message to everyone
        if (io.sockets.connected[obj.socket]) {
          io.sockets.connected[obj.socket].emit('match-complete', clientInfo);
        }
        if (io.sockets.connected[obj.partner]){
          io.sockets.connected[obj.partner].emit('match-complete', newObj);
        }

        updateStaffQueue();
        updateCustomerQueuePosition();

      }
    })

    var clientInQueue = function(uid) {
      return queue.indexOf(uid) > -1;
    }

    var findId = function(socket){
      for (var key in staff){
        if (staff[key].socket == socket){
          return key;
        }
      }

      for (var key in clientInformation){
        if (clientInformation[key].socket == socket){
          return key;
        }
      }

      return null;
    }

    socket.on('updatecustomer', function(data){
      let uid = data.uid;
      if(clientInformation.hasOwnProperty(uid)){
        clientInformation[uid].name = data.customer.name;
        clientInformation[uid].description = data.customer.description;
        clientInformation[uid].email = data.customer.email;
      }
    })

    // When closing the browser
    socket.on('disconnect', function(data){
      console.log('Disconnecting ' + socket.id);
      let socketId = socket.id;
      let uid = findId(socketId);

      if (uid != null){
        setTimeout(function () {
          if (clientInformation.hasOwnProperty(uid)){
            let disconnect = clientInformation[uid].socket == socket.id;

            if (disconnect){

              clientInformation[uid].name = '';
              clientInformation[uid].description = '';
              clientInformation[uid].email = '';

              // Check the queue and in chat
              if (clientInQueue(uid)){
                removeFromQueue(uid);
              }
              else if (isClientInChat(uid)){
                endConversation(uid, 'customer');
                disableChat(clientsInChat[uid].partnerId, 'staff');
                delete staffInChat[clientsInChat[uid].partnerId];
                delete clientsInChat[uid];
              }
            }
            else {
              // The user reconnected within 10 seconds and now has a new socket id
            }
          }
          else if (staff.hasOwnProperty(uid)){
            let disconnect = staff[uid].socket == socket.id;

            if (disconnect){
              // Check the queue and in chat
              if (isStaffInChat(uid)){
                endConversation(uid, 'staff');
                endConversation(staffInChat[uid].partnerId, 'customer');
                delete clientsInChat[staffInChat[uid].partnerId];
                delete staffInChat[uid];
                
              }
            }
            else {
              // The user reconnected within 10 seconds and now has a new socket id
            }
          }
        }, 10000);
      }
    })

    var removeStaff = function(uid){
      delete staff[uid];
    }

    var isClient = function(uid){
      return (clientsInChat.hasOwnProperty(uid) || (queue.indexOf(uid) > -1));
    }

    var isStaff = function(uid){
      return (staffInChat.hasOwnProperty(uid) || staff.hasOwnProperty(uid));
    }


    var isClientInChat = function(uid){
      return clientsInChat.hasOwnProperty(uid);
    }

    var isStaffInChat = function(uid){
      return staffInChat.hasOwnProperty(uid);
    }

    socket.on('stop-chat', function(data){
      let uid = data.uid;
      // When manually stopping the chat
      //Check if it's a client
      if (clientsInChat.hasOwnProperty(uid)){
        // it's a client
        stopConversationByClient(uid);
      }
      else {
        if (staffInChat.hasOwnProperty(uid)){
          stopConversationByStaff(uid);
        }
      }
    })

    var stopConversationByClient = function(uid){
      var staffId = clientsInChat[uid].partnerId;
      delete clientsInChat[uid];

      delete staffInChat[staffId];

      disableChat(staffId);
      endConversation(uid, 'customer');
      updateStaffQueue();
    }

    var stopConversationByStaff = function(uid){
      console.log('Stopping conversation by staff');
      var clientId = staffInChat[uid].partnerId;

      delete clientsInChat[clientId];
      delete staffInChat[uid];

      endConversation(clientId, 'customer');
      endConversation(uid, 'staff');
      updateStaffQueue();

    }

    var disableChat = function(id){
      console.log('disableChat');
      if (io.sockets.connected.hasOwnProperty(staff[id].socket)) {
        console.log('Has property so should emit');
        io.sockets.connected[staff[id].socket].emit('disableChat',{type: 'disableChat'});
      }
    }

    var endConversation = function(id, type){
      if (type == 'staff'){
        if (io.sockets.connected.hasOwnProperty(staff[id].socket)) {
          io.sockets.connected[staff[id].socket].emit('endConversation',{type: 'endConversation'});
        }
      }
      else {
        console.log('Ending conversation of user');
        if (io.sockets.connected.hasOwnProperty(clientInformation[id].socket)) {
          console.log('Customer found');
          io.sockets.connected[clientInformation[id].socket].emit('endConversation',{type: 'endConversation'});
        }
      }
      
    }

    var removeFromQueue = function(uid){
      var index = queue.indexOf(uid);
      if (index > -1) {
        queue.splice(index, 1);
      }
      updateStaffQueue();
      updateCustomerQueuePosition();

    }

    socket.on('getChat', function(data){
      let uid = data.uid;
      console.log('Getting chat');

      console.log("in chat staff? ", staffInChat[uid]);

      console.log("staff member: ", staff[uid]);

      if (staffInChat.hasOwnProperty(uid)){
        console.log('continueee');
        socket.emit('continue', {
          type: 'continue',
          partner: clientInformation[staffInChat[uid].partnerId],
          chat: staffInChat[uid].chat,
          ticket: staffInChat[uid].ticket
      });
      }
    })

    socket.on('update', function(data){
      let uid = data.uid;

      if (staff.hasOwnProperty(uid)){
        updateStaffQueue();
      }
    })

    //Leaving the queue
    socket.on('stopQueue', function(data){
      removeFromQueue();
      updateStaffQueue();
    })

    socket.on('add-message', function(data){
      
      let uid = data.uid;
      let message = data.message;

      var partnerSocket = findPartner(uid);
      var name = findName(uid);

      var messages = message.split("\n");

      var msg = {
        from: name,
        text: messages
      }

      console.log(msg);
      console.log('Origin of emssage: ', uid);
      console.log('Socket found: ', partnerSocket);

      if (staffInChat.hasOwnProperty(uid)){
        console.log('Sent by staff');
        staffInChat[uid].chat.push(msg);
        clientsInChat[staffInChat[uid].partnerId].chat.push(msg);
      }

      if (clientsInChat.hasOwnProperty(uid)){
        console.log('Sent by customer');
        clientsInChat[uid].chat.push(msg);
        staffInChat[clientsInChat[uid].partnerId].chat.push(msg);
      }

      if (io.sockets.connected[partnerSocket]) {
        console.log('SENDING MESSAGE TO CUSTOMER AND STAFF');
        console.log(partnerSocket);
        io.to(partnerSocket).emit('message',{type:'new-message', messages: msg});
        io.to(socket.id).emit('message',{type:'new-message', messages: msg});

        // io.sockets.connected[partnerSocket].emit('message',{type:'new-message', messages: msg});
        // io.sockets.connected[socket.id].emit('message', {type: 'new-message', messages: msg});
      }
    })

    var updateCustomerQueuePosition = function(){
      for (i = 0; i < queue.length; i++) {
        sendPositionInQueue(queue[i]);
      }

    }

    var sendPositionInQueue = function(id){
      var index = queue.indexOf(id);
      var position = index + 1;
      if (io.sockets.connected[clientInformation[id].socket]) {
        io.sockets.connected[clientInformation[id].socket].emit('queue-position',{type:'queue-position', position: position});
      }
    }

    var findName = function(uid){
      if (clientsInChat.hasOwnProperty(uid)){
        return clientInformation[uid].name;
      }
      else {
        if (staffInChat.hasOwnProperty(uid)){
          return staff[uid].name;
        }
      }
    }

    var findPartner = function(uid){
      if (clientsInChat.hasOwnProperty(uid)){
        return clientsInChat[uid].partner;
      }
      else {
        if (staffInChat.hasOwnProperty(uid)){
          return staffInChat[uid].partner;
        }
      }
    }
  });

  
}
