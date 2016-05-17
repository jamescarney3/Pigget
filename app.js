var RtmClient = require('@slack/client').RtmClient;
var request = require('request');
var _ = require('underscore');

var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {logLevel: 'info'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  var text = message.text;
  var user = message.user;
  var ckRegs = {gg: /ck/g, gG: /cK/g, Gg: /Ck/g, GG: /CK/g};

  if(_.any(ckRegs, function(v, k){ return text.match(v); }) && isPickett(user)){
    _.each(ckRegs, function(v, k){
      text = text.replace(v, k);
    });
    rtm.sendMessage(text, message.channel);
  }
});

var isPickett = function(user){
  if(user == process.env.PICKETT_SLACK_ID){
    return true;
  }else{
    return false;
  }
}
