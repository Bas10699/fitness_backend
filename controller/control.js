var db = require('../connect/db_connect')
var encrypt = require('../const/encrypt')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var testfile = 'testfile.txt'
var error_message = require('../const/error_message')
var fs = require('fs')


exports.new_file = () => {
    return (req, res, next) => {
        fs.open('testfile.txt', 'w', (err, file) => {
            if (err) throw err;
            else {
                console.log('Saved!')
                req.result = file
                next()
            }
        })
    }
}

exports.write_file = () => {
    return (req, res, next) => {
        fs.writeFile('testfile.txt', 'สวัสดีชาวโลก', (err, file) => {
            if (err) throw err;
            else {
                console.log('Saved!')
                req.result = file
                next()
            }
        })
    }
}

exports.read_file = () => {
    return (req, res, next) => {
        fs.readFile("testfile.txt", (err, data) => {
            if (err) throw err
            else {
                req.result = data.toString()
                next()
            }
        })
    }
}

exports.read_img = () => {
    return (req, res, next) => {
        fs.readFile("D:/fitnesspos/fitness/image/test.jpg", (err, data) => {
            if (err) throw err
            else {
                console.log(data)
                req.result = (data).toString('base64')
                
                if(req.result){
                    if (err) throw err
                    else{
                        fs.writeFile('./image/test3.jpg',req.result,'base64',(err,data)=>{
                            next()
                        })
                        
                        
                    }
                }
            }
        })
    }
}

exports.cop_text = () => {
    return (req, res, next) => {
        fs.readFile(testfile, (err, data) => {
            if (err) throw err
            else {
                result = data.toString()
                fs.writeFile('mynewfile1.txt', result, (err, file) => {
                    if (err) throw err
                    else {
                        req.result = file
                        console.log('Saved!')
                    }
                    next()
                })

            }
        })
    }
}



exports.show_user = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM user_login'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.update_user = () => {
    return (req, res, next) => {
        let update_data = {
            user: req.body.user,
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            phone_number: req.body.phone_number
        }
        db.query('SELECT*FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
            if (err) throw err

            if (result[0]) {
                db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.user_id], (err, result) => {
                    if (err) throw err;
                    else {
                        req.result = result
                        console.log('อัพเดทได้แล้วนะไอ้หนุ่ม')
                        next()
                    }
                })
            }
            else {
                console.log('ไม่พบข้อมูลผู้มช้งาน')
                res.status(200).json(error_message.err_update_not_found)
            }
        })

    }
}


exports.add_register = () => {
    return (req, res, next) => {

        var data = {
            user: req.body.user,
            name: req.body.name,
            last_name: req.body.last_name,
            password: encrypt.encrypt(req.body.password),
            email: req.body.email,
            address: req.body.address,
            phone_number: req.body.phone_number
        }
        db.query('INSERT INTO user_login SET ?', data, (err, result) => {
            if (err) {
                console.log('error ocurred');
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('User Not');
                    res.status(200).json({
                        'Success': false,
                        'error_message': 'บัญชีนี้มีผู้ใช้งานแล้ว'
                    })
                }
                else
                    throw err;
            }
            else
                next()
        })
    }
}
exports.user_valid = () => {
    return (req, res, next) => {
        db.query('SELECT*FROM user_login WHERE user_id = ? ', req.user_id, (err, result) => {
            if (err) throw err
            else {
                req.result = result
                next()
            }
        })
    }
}
exports.login = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM `user_login` WHERE user= ?', req.body.user, (err, result) => {
            if (err) throw err;
            if (result[0]) {
                let password = result[0].password
                if (bcrypt.compareSync(req.body.password, password)) {
                    // res.send('wellcome bro!')
                    req.token = jsonwebToken.sign({
                        id: result[0].user_id
                    }, 'secret')
                    next()
                }
                else
                    res.status(200).json(error_message.err_wrong_password)

            }
            else
                res.status(200).json(error_message.user_work_not_found)

        })
    }
}

exports.update_password = () => {
    return (req, res, next) => {
        db.query('SELECT*FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
            if (err) throw err;
            if (result[0]) {
                let password = result[0].password
                if (bcrypt.compareSync(req.body.password, password)) {
                    let pass_update = {
                        password: encrypt.encrypt(req.body.new_password)
                    }
                    db.query('UPDATE user_login SET password = ? WHERE user_id = ?', [pass_update.password, req.user_id], (err, result) => {
                        if (err) throw err;
                        req.result = result
                        console.log('อัพเดทรหัสผ่านสำเร็จ')
                        next()
                    })
                }
                else
                    res.status(200).json(error_message.err_check_password)
            }
            else
                res.status(200).json(error_message.err_update_not_found)
        })
    }
}
