// YOUR CODE HERE:

var app = {

  server: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',

  init: function() {

    var that = this;

    setInterval(function(){
      that.fetch();
    },2000);

    // setTimeout(setInterval(function(){ that.clearMessages(); },2000), 1000);
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
      dataType: 'json',
      success: function (data) {
        app.clearMessages();
        for (var i = 0; i < data.results.length; i++) {
          app.addMessage(data.results[i]);
        }

        console.log('chatterbox: Message fetched');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage: function(message) {
    var username;
    var text;

    if (message.username === undefined || message.text === undefined) {
      username = "I'm bad at this";
      text = "Also I don't know how to this. Halp";
    } else {
      username = message.username.replace(/[^a-z,.!?' ]+/gi, " ");
      text = message.text.replace(/[^a-z,.!?' ]+/gi, ", I am a dick");
    }
    var $toSend = '<div class="chat"><a href="">' + username + "</a>: " + text + '</div>';
    $('#chats').append($toSend);
  },

  clearMessages: function() {
    $('.chat').remove(); // can also use .html('')
    console.log('clearing success');
  },

  addRoom: function() {},

  handleSubmit: function() {
    var msg = {
      username: location.search.substring(10),
      text: $('.draft').val(),
      roomname: 'abattoir'
    };
    this.send(msg);
  },


  addFriend: function() {}


};

$(document).ready(function(){
  // var USER = location.search.substring(10);
  // console.log(USER);
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


});
