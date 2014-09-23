var app = {

  server: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',

  friends: [],

  messageOptions: '<div id="options"> <span>hello</span> <span>yes</span> </div>',

  init: function() {

    var that = this;

    setTimeout(function(){
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

  fetch: function(targetUsername) {
    targetUsername = targetUsername || null;

    $.ajax({

      targetUsername: targetUsername,
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        app.clearMessages();

        for (var i = 0; i < data.results.length; i++) {

          if (data.results[i].username === targetUsername) {
            //console.log('found username match', targetUsername);
            // app.clearMessages();
            app.addMessage(data.results[i]);
          } else if (targetUsername === null) {
            app.addMessage(data.results[i]);
          }
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

  addRoom: function() {},

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

  // $('#chats').on('hover', '.username', function() {
  //   $('#options').show();
  //   console.log('hover handler is working');
  //   // app.friends.push($(this).text());
  //   return false;
  // }, function() {
  //   $('#options').hide();
  // });

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
