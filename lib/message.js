var express = require('express');
var res = express.reponse;

res.message = function(msg,type){
  type = type || 'info';
  var sess = this.req.session;
  sess.messages = sess.message || [];
  sess.messages.push({type:type,string:msg});
};

res.error = function(msg){
  return this.message(msg,'error');
};

module.exports = function(req,res,next){
  res.locals.message = req.session.message || [];
  res.locals.removeMessages = function(){
    req.session.message = [];
  };
  next();
};
