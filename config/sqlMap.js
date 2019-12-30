var sqlMap = {
    admin: {
        select_name: 'select * from admin where account = ?',//登录
        update_pwd:'update admin set password = ? WHERE account = ?',
    },
    user: {
        add: 'insert into user (id,username,password,email,mobile,createtime) values (uuid(),?,?,?,?,?)',//注册
        select_name: 'select * from user where username = ?',//登录
        selectall: 'select * from user',//列表
        update: 'update user set email = ?,mobile = ? WHERE id = ?',
        update_state: 'update user set state = ? WHERE id = ?',
        delete_name: 'delete from user where id = ?',
    }
}

module.exports = sqlMap;