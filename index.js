const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const api = require('./router/api')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//解决 跨域问题  Access-Control-Allow-Origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //允许所有不同源的地址访问
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization') //Content-Type必须要设置，Authorization是用户登录注册时存入的token值，可根据需求来设置，还有其他的都需要用逗号隔开
    res.header('Access-Control-Allow-Credentials', true) // 这个必须要设置，否则解决跨域无效，注意true是字符串
    next()
})

app.use('/api', api)

app.listen(8888, (req, res) => {
    console.log('Server running at http://127.0.0.1:8888/');
})