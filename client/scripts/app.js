// YOUR CODE HERE:
var app = {server: 'https://api.parse.com/1/classes/messages'};

app.init = function() {
  // app.friends = [];
  app.fetch();
  setInterval(app.fetch, 1000);
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
    data: {'order': '-createdAt'},
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
      var filtered = data.results.filter(message => message.roomname ? message.roomname.toUpperCase() === $('#roomSelect').val().toUpperCase() : false);

      for (let i = 0; i < filtered.length; ++i) {
        app.renderMessage(filtered[i]);
      }
    },
    error: function(data) {
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
};

var escape = function(string) {
  // return string;
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  $('#chats').append($('<div class="chat"><div class="username">' + escape(message.username) + ': </div>' + escape(message.text) + '</div>'));
};

app.renderRoom = function(room) {
  $('#roomSelect').append($('<option value=' + room + '>' + room + '</option>'));
};

app.handleSubmit = function() {
  var message = {
    username: window.location.search.slice(10),
    text: $('#messageVal').val(),
    roomname: $('#roomSelect').val()
  };
  // console.log(message);
  app.send(message);
  // app.renderMessage(message);
};

app.handleUsernameClick = function(clicked) {
  let name = clicked.html().slice(0, -2);
  $('.username').each(function() {
    if ($(this).html().slice(0, -2) === name) {
      console.log($(this).html().slice(0, -2));
      $(this).parent().css('font-weight', 800);
    }
  });

  // if (app.friends.indexOf(name) === -1) {
  //   app.friends.push(name);
  // }
  console.log(app.friends);
};

// app.getSafeObject = function(obj) {
//   for (let item in )
//   var dummy = $('<div></div>').text(string);

//   return dummy.text();
// };



$(document).ready(function() {
  app.init();
  $('#send').submit(function(e) {
    app.handleSubmit();
    // $('#messageVal').val('');
  });

  $('#send').on('click', function() {
    app.handleSubmit();
    // $('#messageVal').val('');
  });

  $('#chats').delegate('.username', 'click', function(e) {
    app.handleUsernameClick($(this));
  });
});