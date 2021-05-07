'use strict';

var express = require('express');
var users = require('./users');
var homes = require('./home');
var members = require('./member');
var testdb = require('./testDB');
var app = express();
app.use('/user', users);
app.use('/', homes);
app.use('/member', members);
app.use('/testdb', testdb);

module.exports = app;
