'use strict';

var RtmClient = require('@slack/client').RtmClient;
var request = require('request');
var _ = require('underscore');
var querystring = require('querystring');
var keys = require('./keys.js');

console.log(keys);

var token = keys.SLACK_API_TOKEN;
var ckRegs = {gg: /ck/g, gG: /cK/g, Gg: /Ck/g, GG: /CK/g};

const isTum = (user) => {
  if(user === keys.TUM_SLACK_ID){
      return true;
    }else{
      return false;
    }
};

const isPickett = (user) => {
  if(user === keys.PICKETT_SLACK_ID){
      return true;
    }else{
      return false;
    }
};

exports.handler = (event, context, callback) => {
  var rtm = new RtmClient(token, {logLevel: 'info'});
  rtm.start();

  var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
  var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    console.log(`${rtmStartData.self.name} logged into ${rtmStartData.team.name}`);
  });

  rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
    const message = querystring.parse(event);
    const text = message.text;
    const user = message.user_id;
    const channel = message.channel_id;

    if(isTum(user) && text == 'hi, pigbot!'){
      rtm.sendMessage('hi, tum!', channel, function(){
        process.exit(0);
      });
    } else if (_.any(ckRegs, function(v, k){ return text.match(v); }) && isPickett(user)){
      _.each(ckRegs, function(v, k){
        reply = text.replace(v, k);
      });
      rtm.sendMessage(reply, channel, function(){
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
};
