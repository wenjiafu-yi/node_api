module.exports = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'db_management',
        connectTimeout: 3000, //连接超时
        multiplStatements: true //是否允许一个query中包含多条sql语句
    }
}