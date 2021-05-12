'use strict';
var express = require('express');
var router = express.Router();
//var db = require('../db/sqlserver.js')
const sql = require('mssql')
var dbconfig=require('../db/config')

function AjaxResult(success, message, redirectUrl, isReload,data) {
	this.success = success||false;
	this.message = message||'';
	this.redirectUrl = redirectUrl||'';
	this.isReload = isReload || '';
	this.data = data || '';
}

//登录
router.get('/', function (req, res) {
	res.redirect('/index.html');
});
router.post('/api/login', function (req, res) {
	var results = new AjaxResult();
	if (req.body['username'] == '' || req.body['pwd'] == '') {
		results.message ='请填写必须项'
		return res.json(results)
	}
	var time = new Date().getTime();
	var name = req.body['username'];
	var pwd = req.body['pwd'];
	new sql.ConnectionPool(dbconfig).connect().then(pool => {
		return pool.query`select * from Admins where username=${name}`
	}).then(result => {
		if (result.recordset.length) {
			if (result.recordset[0].Password != pwd) {
				results.message = '密码不正确';
				return res.send(results)
			}
			req.session.login = true;
			req.session.username = result.recordset[0].UserName;
			req.session.userid = result.recordset[0].Id;
			results.success = true;
			results.message = '登录成功';
			results.data = result.recordset;
			return res.json(results)
		} else {
			results.message='用户不存在'
			return res.send(results)
			}
		}).catch(err => { return res.send(err) })
})

//检测用户名
router.post('/api/checkuser', function (req,res) {
	var results = new AjaxResult();
	var name = req.body['username'];
	new sql.ConnectionPool(dbconfig).connect().then(pool => {
		return pool.query` select username from Admins where UserName = ${name}`
	}).then(result => {
		if (result.recordset.length) {
			results.message='用户名已存在'
			return res.send(results)
		}
		results.success = true;
		results.message = '用户名可以使用'
		return res.send(results)
		}).catch(err => {
			return res.send(err)
		})
})
//注册
router.post('/api/reg', function (req,res) {
	var results = new AjaxResult();
	var time = new Date();
	time.setHours(time.getHours() + 8);
	var name = req.body['username'];
	var pwd = req.body['pwd'];
	var confirm = req.body['confirmpwd'];
	new sql.ConnectionPool(dbconfig).connect().then(pool => {
		return pool.query` if not exists(select username from Admins where UserName=${name})
								insert into Admins values(${name},${pwd},${time},1,null)`
	})
		.then(result => {
			if (result.rowsAffected == 1) {
				results.success = true;
				results.message = '注册成功！'
				return res.send(results)
			} else {
				results.message = '注册失败！用户已存在!'
				return res.send(results)
			}
		})
		.catch(err => {
			return res.send(err);
		});
})

//退出
router.post('/api/logout', function (req, res) {
	var results = new AjaxResult();
	req.session.destroy()
	results.success = true;
	results.message = '退出成功';
	return res.send(results)
})



module.exports = router;