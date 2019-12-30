const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const sqlMap = require('../config/sqlMap')
const moment = require('moment');

//连接数据库
const conn = mysql.createConnection(db.mysql);
conn.connect();

//中间件
const auth = async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    if (!token) {
        res.status(401).send({
            message: "请先登录",
        });
    }
    const tokenData = jwt.verify(token, "secret")
    if (!tokenData.id) {
        res.status(401).send({
            message: "请先登录",
        });
    }

    const select = sqlMap.admin.select_name;

    conn.query(select, [tokenData.name], (err, results) => {
        if (err) throw err;
        if (results.length >= 1) {
            // req.user = results[0]
            // req.user = results[0]
            // console.log(req.body)
            return
        } else {
            res.status(401).send({
                message: "请先登录",
            });
        }
    });
    await next()
}

//登录管理员账号
router.post('/admin/login', (req, res) => {
    var Params = req.body;
    var select = sqlMap.admin.select_name;
    conn.query(select, [Params.account], (err, results) => {
        if (err) throw err;
        if (results.length >= 1) {
            //2、如果有用户名，查询密码是否相同
            if (Params.password == results[0].password) {
                //3、密码相同则登陆成功
                const token = jwt.sign({
                    id: results[0].id,
                    name: Params.account
                }, "secret")
                res.status(200).send({
                    message: '登陆成功',
                    token
                })
            } else {
                res.status(422).send({
                    message: '登陆失败，用户名密码错误'
                })
            }
        } else {
            res.status(422).send({
                message: '登陆失败,用户不存在'
            })
        }
    });

});

//获取用户列表
router.get('/admin/userList', auth, (req, res) => {
    var select = sqlMap.user.selectall;
    conn.query(select, (err, results) => {
        if (err) throw err;
        if (results.length >= 1) {
            res.json({
                code: 500,
                title: "用户列表",
                msg: "success",
                results
            });
        } else {
            res.json({
                code: 505,
                msg: "没有数据",
            });
        }
    });
});

//根据用户名查找用户
router.post('/admin/searchUser', auth, function (req, res) {
    var select_name = sqlMap.user.select_name;

    conn.query(select_name, [req.body.username], (err, results) => {
        if (err) throw err;
        if (results.length >= 1) {
            res.json({
                code: '200',
                msg: '查找成功',
                results
            });
        } else {
            res.json({
                code: '400',
                msg: '查找失败'
            });
        }
    });
});

//添加用户
router.post('/admin/addUser', auth, (req, res) => {
    var Params = req.body;
    var add = sqlMap.user.add;
    var select = sqlMap.user.select_name;
    var createtime = moment().format('YYYY-MM-DD HH:mm:ss');
    conn.query(select, [Params.username], (err, results) => {
        if (err) throw err;
        if (results.length >= 1) {
            res.status(422).send({
                message: '添加失败，用户名已存在'
            })
        } else {
            conn.query(add, [Params.username, Params.password, Params.email, Params.mobile, createtime], (err, results) => {
                if (err) throw err;
                //3、如果没有相同用户名，并且有一条记录，则注册成功
                if (results.affectedRows == 1) {
                    res.status(200).send({
                        message: '添加成功'
                    })
                } else {
                    res.status(422).send({
                        message: '添加失败'
                    })
                }
            });
        }
    });
});

//更新用户信息
router.post('/admin/updateUser', auth, (req, res) => {
    var Params = req.body;
    var update = sqlMap.user.update;

    conn.query(update, [Params.email, Params.mobile, Params.id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows == 1) {
            res.status(200).send({
                message: '修改成功'
            })
        } else {
            res.status(422).send({
                message: '修改失败'
            })
        }
    });
});

//更新用户状态
router.post('/admin/userState', auth, (req, res) => {
    var Params = req.body;
    var update = sqlMap.user.update_state;

    conn.query(update, [Params.state, Params.id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows == 1) {
            res.status(200).send({
                message: '修改成功'
            })
        } else {
            res.status(422).send({
                message: '修改失败'
            })
        }
    });
});

//删除用户
router.post('/admin/deleteUser', function (req, res) {
    console.log(req.body.id)
    var delete_name = sqlMap.user.delete_name;
    conn.query(delete_name, [req.body.id], function (err, results) {
        if (err) throw err;
        if (results.affectedRows == 1) {
            res.status(200).send({
                message: '删除成功'
            })
        } else {
            res.status(422).send({
                message: '删除失败'
            })
        }
    });
});

//更改管理员密码
router.post('/admin/updatePwd', auth, (req, res) => {
    var Params = req.body;
    var update = sqlMap.admin.update_pwd;

    conn.query(update, [Params.password, Params.account], (err, results) => {
        if (err) throw err;
        if (results.affectedRows == 1) {
            res.status(200).send({
                message: '修改成功'
            })
        } else {
            res.status(422).send({
                message: '修改失败'
            })
        }
    });
});
module.exports = router