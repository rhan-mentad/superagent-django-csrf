'use strict';

var request = require('superagent');

function sameOrigin(url) {
  // url could be relative or scheme relative or absolute
  var host = document.location.host; // host + port
  var protocol = document.location.protocol;
  var sr_origin = '//' + host;
  var origin = protocol + sr_origin;
  // Allow absolute or scheme relative URLs to same origin
  return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
      (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
      !(/^(\/\/|http:|https:).*/.test(url));
}

function safeMethod(method) {
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// patch superagent to attach CSRF-token to all requests
try {
  var csrf = document.cookie.match(/csrftoken=(.*?)(?:$|;)/)[1];
  var end = request.Request.prototype.end;
  request.Request.prototype.end = function(fn) {
    if(!safeMethod(this.method) && sameOrigin(this.url)) {
      this.set('X-CSRFToken', csrf);
    }
    return end.call(this, fn);
  };
}
catch (err) {
  
}

