var apiKey,
    sessionId,
    token;
  apiKey = "45605772";
  sessionId = "1_MX40NTYwNTc3Mn5-MTQ5NDg3ODYyNDA2Mn5OYllqdERlOFRjWGpCVk0yTm9HTzMwSlR-fg";
  token = "T1==cGFydG5lcl9pZD00NTYwNTc3MiZzaWc9MjBiMDZiOWRhOGRmZWI1Nzc1YWZkY2RjM2EwNGQ1NjY0MTIyMTFlYTpzZXNzaW9uX2lkPTFfTVg0ME5UWXdOVGMzTW41LU1UUTVORGczT0RZeU5EQTJNbjVPWWxscWRFUmxPRlJqV0dwQ1ZrMHlUbTlIVHpNd1NsUi1mZyZjcmVhdGVfdGltZT0xNDk0ODc4NzIxJm5vbmNlPTAuNzIyOTU0MTg3NDcxNjk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDk1NDgzNTIw";
var session;

$(document).ready(function() {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  initializeSession();
});

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'subscriber', {
     insertMode: 'append',
     width: '100%',
     height: '100%'
    });
  });

  session.on('sessionDisconnected', function(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      });

      session.publish(publisher);
    } else {
      console.log('There was an error connecting to the session: ', error.code, error.message);
    }
  });

  // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function(event) {
    var msg = document.createElement('p');
    msg.innerHTML = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });
}

// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form
form.addEventListener('submit', function(event) {
  event.preventDefault();

  session.signal({
      type: 'msg',
      data: msgTxt.value
    }, function(error) {
      if (!error) {
        msgTxt.value = '';
      }
    });
});

