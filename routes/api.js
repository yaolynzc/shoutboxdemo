var express = require('express');
var basicauth = require('basicauth-middleware');
var User = require('../lib/user');
var app = express();

exports.auth = app.use(basicauth(User.authenticate));

exports.user = function(req,res,next){
  User.get(req.params.id,function(err,user){
    if(err) return next(err);
    if(!user.id) return res.send(404);
    res.json(user);
  });
};