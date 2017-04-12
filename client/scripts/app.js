// YOUR CODE HERE:


var Chatterbox = function() {
  this.init();
  this.rooms = new Set(['lobby']);
  // this.messages;
};

Chatterbox.prototype.addData = function(data) {
  var newJSON = JSON.parse(data.responseText);

  this.messages = newJSON.results;
  // console.log(this.messages);
  return newJSON.results;
};


Chatterbox.prototype.render = function() {
  // console.log(this.messages);

  if (this.messages) {
    $('#chats div').remove();
    for (var i = this.messages.length - 100; i < this.messages.length; i++) {
      var current = this.messages[i];

      var roomname = current.roomname;

      if (!this.rooms.has(roomname)) {
        this.rooms.add(roomname);
        var newOption = $('<option></option>').text(roomname);
        $('#roomList').append(newOption);
      }






      var container = $('<div></div>');
      var message = $('<h3 class="msg"></h3>').text(current.text);
      var date = $(`<p class="date">${current.createdAt}</p>`);

      // var username = $(`<p class="username">${current.username}</p>`);
      var username = $(`<p class="username"></p>`).text(current.username);

      var roomname = $(`<p class="roomname"></p>`).text(current.roomname);


      container.append(message);
      container.append(date);
      container.append(username);
      container.append(roomname);

      $('#chats').prepend(container);
    }
  }
};

Chatterbox.prototype.init = function() {

  this.fetch();
  this.render();

  setTimeout(this.init.bind(this), 5000);
};



Chatterbox.prototype.send = function(data) {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    context: this,
    success: function (data) {
      console.log('chatterbox: POST sent');
    },
    complete: function(response) {
      // console.log(response);
      this.fetch();
    },
    error: function (data) {
      console.error('chatterbox: Failed to send POST', data);
    }
  });
};



Chatterbox.prototype.fetch = function() {
  $.ajax({
    type: 'GET',
    context: this,
    data: 'limit=$all',
    // dataType: "jsonp",
    complete: function(response) {
      // console.log(response);
      this.addData(response);
      this.render();
    },
    success: function (response) {
      console.log('chatterbox: GET sent');
    },
    error: function (response) {
      console.error('chatterbox: Failed to send GET', response);
    }
  });
};

Chatterbox.prototype.newMessage = function() {

  var getParameterByName = function(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    // if (!results) return null;
    // if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  var room = document.getElementById('roomList').value
  if (room == 'New Room') {
    room = prompt('Enter new room');
  }

  // console.log( document.getElementById('roomList').value );
  var text = document.getElementById('inputText').value;
  var dataObj = {
    roomname: room,
    text: text,
    username: getParameterByName('username')
  };
 this.send(dataObj);

};

var app = new Chatterbox();

// var msgObject = {
//   roomname: 'lobby',
//   text: 'usernames are input too!! <3 tyler',
//   username: '<script>$("#chats").css("background-color","blue")</script>'
// };

// app.send(msgObject);



// console.log(getParameterByName('username'));
