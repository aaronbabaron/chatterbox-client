/* jshint esversion: 6*/
// YOUR CODE HERE:
class App {
  constructor() {
    this.rooms = ['createNewRoom', 'lobby'];
    this.server = 'https://api.parse.com/1/classes/messages';
    this.entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#x2F;'
    };
    this.friends = [];
  }
  
  escape(string) {
    // return string;
    var context = this;
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return context.entityMap[s];
    });
  }

  init() {
    this.fetch();
    setInterval(this.fetch.bind(this), 1000);
  }

  send(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        $('#messageVal').val('');
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      data: {'order': '-createdAt'},
             // 'where': {'roomname': {'$in': [$('#roomSelect').val()]}}},
      type: 'GET',
      context: this,
      contentType: 'application/json',
      success: function(data) {
        var roomNames = data.results.map(value => value.roomname);
        var unique = _.uniq(roomNames);

        for (let i = 0; i < unique.length; ++i) {
          if (this.rooms.indexOf(unique[i]) === -1) {
            this.rooms.push(unique[i]);
            this.renderRoom(unique[i]);
          }
        }

        var filtered = data.results.filter(message => message.roomname ? message.roomname.toUpperCase() === String($('#roomSelect').val()).toUpperCase() : false);
        
        // var filtered = data.results;
        $('#chats').html('');
        for (let i = 0; i < filtered.length; ++i) {
          this.renderMessage(filtered[i]);
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive messages', data);
      }
    });
  }

  clearMessages() {
    $('#chats').html('');
  }

  renderMessage(message) {
    var messageContainer = $('<div class="chat"><div class="username">' + this.escape(message.username) + ': </div>' + this.escape(message.text) + '</div>');
    if (this.friends.indexOf(message.username) !== -1) {
      messageContainer.css('font-weight', 800);
    }
    $('#chats').append(messageContainer);
  }

  renderRoom(room) {
    var exists = false;
    var context = this;
    $('#roomSelect option').each(function() {
      if (context.escape($(this).val()) === context.escape(room)) {
        // alert('Room already exists ' + room);
        exists = true;
        return false;
      }
    });

    if (!exists) {
      if (this.rooms.indexOf(room) === -1) {
        this.rooms.push(room);
      }
      $('#roomSelect').append($('<option value=' + this.escape(room).toLowerCase() + '>' + this.escape(room) + '</option>'));
    }
  }

  handleSubmit() {
    var message = {
      username: window.location.search.slice(10),
      text: $('#messageVal').val(),
      roomname: $('#roomSelect').val()
    };
    // console.log(message);
    this.send(message);
    // app.renderMessage(message);
  }

  handleUsernameClick(clicked) {
    let name = clicked.html().slice(0, -2);
    if (this.friends.indexOf(name) === -1) {
      this.friends.push(name);
    } 
    // $('.username').each(function() {
    //   if ($(this).html().slice(0, -2) === name) {
    //     console.log($(this).html().slice(0, -2));
    //     $(this).parent().css('font-weight', 800);
    //   }
    // });
  }
}


$(document).ready(function() {
  var app = new App();
  app.init();
  $('#send').submit(function(e) {
    app.handleSubmit();
    // $('#messageVal').val('');
  });

  $('#send').on('click', function() {
    app.handleSubmit();
    // $('#messageVal').val('');
  });

  // $('#chats').delegate('.username', 'click', function(e) {
  //   app.handleUsernameClick($(this));
  // });

  $('#chats').on('click', '.username', function(e) {
    app.handleUsernameClick($(this));
  });

  $('#roomSelect').change(function() {
    if ($(this).val() === 'createNewRoom') {
      var roomName = escape(prompt('Name your room')) || undefined;
      if (roomName) {
        app.renderRoom(roomName);
        $('#roomSelect').val(roomName);
      }
    } else {
      $('#chats').html('');
      app.fetch();
      $('.active').text($(this).val());
    }
  });
  
  $('body').on('click', '.tab', function() {
    $('#roomSelect').val($(this).text().toLowerCase());

    $('.tab').removeClass('active');
    $(this).addClass('active');
  });

  $('#newTab').on('click', function() {
    $('#newTab').before('<a class="tab" href="#">' + 'New Tab' + '</a>');
  });

});

