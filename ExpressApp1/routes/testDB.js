'use strict';
var express = require('express');
var router = express.Router();
const sql = require('mssql')
var dbconfig = require('../db/config')
router.post('/', function (req,res) {
	new sql.ConnectionPool(dbconfig).connect().then(pool => {
		return pool.query` select * from Admins`
	})
		.then(result => {
			return res.send(result)
		})
		.catch(err => {
			return res.send(err)
		});
})
router.post('/arg', function (req, res) {
	return res.send(req.body)
	new sql.ConnectionPool(dbconfig).connect().then(pool => {
		return pool.query` select * from Admins`
	})
		.then(result => {
			return res.send(result)
		})
		.catch(err => {
			return res.send(err)
		});
})

module.exports = router;