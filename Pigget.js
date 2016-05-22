'use strict';

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

var request = require('request');
var _ = require('underscore');
var querystring = require('querystring');

var keys = require('./keys.js').keys;

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

const reply = (rtm, event) => {
  const message = querystring.parse(event.postBody);
  let text = message.text;
  const user = message.user_id;
  const channel = message.channel_id;

  if(isTum(user) && text == 'hi, pigbot!'){
    rtm.sendMessage('hi, tum!', channel, function(){
      process.exit(0);
    });
  } else if (_.any(ckRegs, function(v, k){ return text.match(v); }) && isPickett(user)){
    _.each(ckRegs, function(v, k){
      text = text.replace(v, k);
    });
    rtm.sendMessage(text, channel, function(){
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

exports.handler = (event, context, callback) => {
  var rtm = new RtmClient(token, {logLevel: 'info'});
  rtm.start();

  rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
    reply(rtm, event);
  });
};
