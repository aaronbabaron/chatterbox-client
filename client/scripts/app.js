/* jshint esversion: 6 */
class ChatApp {
  constructor(server) {
    this.server = server || 'https://api.parse.com/1/classes/messages';
    this.messages = null;
  }

  init() {
    this.fetch();
  }

  send(message) {
    $.ajax({
      url: this.server,
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
  }

  fetch() {
    var deferred = $.Deferred();

    $.ajax({
      url: this.server,
      type: 'GET',
      dataType: 'json',
      context: this,
      success: function(data) {
        this.messages = data; 
        deferred.resolve();
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive messages', data); 
      }
    });

    return deferred.promise();
  }

  clearMessages() {
    $('#chats').html('');  
  }

  renderMessage(message) {
    var chatElem = $('<div class="chatElement"></div>');
    chatElem.text(message.username + ': ' + message.text);

    var room = $('#' + message.roomname);

    if (room.length) {
      room.append(chatElem); 
    } else {
      $('#chats').append(chatElem); 
    }
  }
}
var app = new ChatApp();

$(document).ready(function() {

  $('#roomDropDown').append("<option value ='Hey'>Hey</option>");
  $('#roomDropDown').change(function() {
    $.when(app.fetch()).then(function() {
      var roomMessages = this.messages.filter(value => $(this).val() === value.roomname);
      console.log(roomMessages);
    });
  });
});
