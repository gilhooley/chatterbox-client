var app = {

  server: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',

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
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  addMessage: function(message) {
    var username;
    var text;

    if (message.username === undefined || message.text === undefined) {
      username = "I'm a terrible person";
      text = "and I can't format messages properly";
    } else {
      username = message.username.replace(/[^a-z,.!?' ]+/gi, " ");
      text = message.text.replace(/[^a-z,.!?' ]+/gi, ", I am a dick");
    }
    var $toSend = '<div class="chat"><a href="">' + username + "</a>: " + text + '</div>';
    $('#chats').append($toSend);
  },

  clearMessages: function() {
    $('.chat').remove();
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


  addFriend: function() {

    //NO FRIENDS :(
  }

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
});
