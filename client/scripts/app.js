var app = {

  server: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',

  friends: [],

  banned: [],

  rooms: [],

  messageOptions: '<div id="options"> <button class="choices" id="friend">Add friend</button> <button class="choices" id="ban">Block</button> </div>',

  init: function() {

    var that = this;

    setInterval(function(){
      that.fetch();
    },2000);

  },

  send: function(message) {
    $.ajax({

      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  handleData: function(data, targetUsername) {
    targetUsername = targetUsername || null;

    app.clearMessages();

    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].username === targetUsername) {
        app.addMessage(data.results[i]);
      } else if (targetUsername === null) {
        app.addMessage(data.results[i]);
        app.addRoom(data.results[i].roomname);
      }
    }
  },

  fetch: function() {

    $.ajax({

      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        app.handleData(data);
        console.log('chatterbox: Message fetched');
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage: function(message) {
    var username;
    var text;


    if (message.username === undefined || message.text === undefined) {
      username = "undefined";
      text = "undefined";
    } else {
      username = message.username.replace(/[^a-z,.!?' ]+/gi, " ");
      text = message.text.replace(/[^a-z,.!?' ]+/gi, ", I am a dick");
    }
    if (app.friends.indexOf(username) !== -1) {
      username =  "<b>" + username + "</b>";
      text = "<b>" + text + "</b>";
    }
    var $toSend = '<div class="chat"><a class="username">' + username + '</a>: ' + text + app.messageOptions + '</div>';
    $('#chats').append($toSend);
  },

  clearMessages: function() {
    $('.chat').remove();
  },

  addRoom: function(roomname) {

    if (roomname === undefined || roomname === "") {
      roomname = "lobby";
    }

    roomname = roomname.replace(/[^a-z,.!?' ]+/gi, "");

    if (app.rooms.indexOf(roomname) === -1) {
      $('#chatrooms').append('<li>' + roomname + '</li>');
      app.rooms.push(roomname);
    }

  },

  handleSubmit: function() {
    var msg = {
      username: location.search.substring(10),
      text: $('.draft').val(),
      roomname: 'abattoir'
    };
    this.send(msg);
  },


  // addFriend: function() {

  //   //NO FRIENDS :(
  // }

};


$(document).ready(function(){

  app.init();

  $('.buttonSend').on('click', function() {
    app.handleSubmit();
    $('.draft').val('');
    return false;
  });

  $('.draft').keypress(function (e) {
    if (e.which == 13) {
      app.handleSubmit();
      $('.draft').val('');
      return false;
    }
  });

  $('body').on('click', '#friend', function() {
    var thatUser = this.parentElement.parentElement.children[0].textContent;
    if (app.friends.indexOf(thatUser) === -1) {
      app.friends.push(thatUser);
    }
  });

  $('body').on('click', '#ban', function() {
    var thatUser = this.parentElement.parentElement.children[0].textContent;
    // TODO
    // deal with overlap between banned list and friends list
    if (app.banned.indexOf(thatUser) === -1) {
      app.banned.push(thatUser);
    }
  });

});
