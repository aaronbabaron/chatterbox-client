// YOUR CODE HERE:
var app = {server: 'https://api.parse.com/1/classes/messages'};

app.init = function() {
  app.fetch();
};

app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
      var filtered = data.results.filter(message => message.roomname.toUpperCase() === $('#roomSelect').val().toUpperCase());

      for (let i = 0; i < filtered.length; ++i) {
        app.renderMessage(filtered[i]);
      }
    },
    error: function(data) {
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  $('#chats').prepend($('<div class="chat"><div class="username">' + message.username + ': </div>' + message.text + '</div>'));
};

app.renderRoom = function(room) {
  $('#roomSelect').append($('<option value=' + room + '>' + room + '</option>'));
};

$(document).ready(function() {
  app.init();
  $('#submitButton').on('click', function() {
    var message = {
      username: window.location.search.slice(10),
      text: $('#messageVal').val(),
      roomname: $('#roomSelect').val()
    };
    // console.log(message);
    app.send(message);
    // app.renderMessage(message);
  });
});