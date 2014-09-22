// YOUR CODE HERE:
//
//
var _message = {
  'username': 'teamFetch',
  'text': 'doop doop',
  'roomname': 'Interbutts'
};

var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {
    this.addMessage(_message);
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
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({

      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message fetched');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage: function(message) {
    var $toSend = '<div class="chat">' + message.username + ": " + message.text + '</div>';
    $('#chats').append('<div>lots of words</div>');
    console.log('done adding message EXCEPT NOT REALLY')

  },

  clearMessages: function() {
    $('#chats').remove(); // can also use .html('')
  },

  addRoom: function() {},

  handleSubmit: function() {},


  addFriend: function() {}


};

app.init();
