var db = require('../connect/db_connect')
var encrypt = require('../const/encrypt')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var testfile = 'testfile.txt'
var error_message = require('../const/error_message')
var fs = require('fs')
var multer = require('multer')


exports.upload_img=() => {
    return (req,res,next) => {
        app.post('/profile', upload.single('avatar'),(err, data) => {
            if(err) throw err
            else{
                
            } 
        })
    }
}
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

exports.cop_img = () => {
    return (req, res, next) => {
        fs.readFile("D:/fitnesspos/fitness/image/test.jpg", (err, data) => {
            if (err) throw err
            else {
                console.log(data)
                req.result = (data).toString('base64')
                if(req.result){
                    if (err) throw err
                    else{
                        fs.writeFile('./image/testee.jpg',req.result,'base64',(err,data)=>{
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
        let sql = 'SELECT * FROM user_login WHERE user_type !="1"'
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
        // console.log('im',req.body.image_profile)
        let update_data = {
            user: req.body.user,
            name: req.body.name,
            // last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            phone_number: req.body.phone_number,
            // user_type: req.body.user_type,
            dob:req.body.dob,
            personal_id:req.body.personal_id,
            gender:req.body.gender,
            name_eng:req.body.name_eng,
            // last_name_eng:req.body.last_name_eng,
        }
        if (req.body.image_profile === `user_app/image/user_${req.user_id}.png`) {
            console.log('yyyy', req.body.image_profile)
            db.query('SELECT * FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
                if (err) throw err
                if (result[0]) {
                    db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.user_id], (err, Setresult) => {
                        console.log('ididi',req.user_id)
                        if (err) throw err;
                        else {
                            req.result = Setresult
                            console.log('อัพเดทสำเร็จ')
                            next()
                        }
                    })
                }
                else {
                    console.log('ไม่พบข้อมูลผู้ใช้งาน')
                    res.status(200).json(error_message.err_update_not_found)
                }
            })

        }
        else {
            db.query('SELECT * FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
                if (err) throw err
                if (result[0]) {

                    db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.user_id], (err, Setresult) => {
                        if (err) throw err;
                        else {
                            fs.writeFile(`./image/user/user_${req.user_id}.png`, req.body.image_profile.slice(23), 'base64', (err, data) => {
                                if (err) throw err;
                                let image_profile = 'user_app/image/user_' + req.user_id + '.png'
                                db.query('UPDATE user_login SET image_profile=? WHERE user_id = ?', [image_profile, req.user_id], (err, result) => {
                                    console.log('re', req.user_id)
                                    if (err) throw err;
                                    console.log('อัพเดทข้อมูลสำเร็จ')
                                    next()
                                })
                            })
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
}


// exports.update_user = () => {
//     return (req, res, next) => {
//         let update_data = {
//             user: req.body.user,
//             name: req.body.name,
//             // last_name: req.body.last_name,
//             email: req.body.email,
//             address: req.body.address,
//             phone_number: req.body.phone_number,
//             // user_type: req.body.user_type,
//             // image_profile: req.body.image_profile
//         }
//         console.log('body',req.body)
//         if (req.body.image_profile === `user_app/image/user_${req.body.user_id}.png`) {
//             db.query('SELECT*FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
//                 if (err) throw err;
//                 if (result[0]) {
//                     db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.user_id], (err) => {
//                         if (err) throw err;
//                         req.result = result
//                         console.log('อัพเดทข้อมูลสำเร็จ')
//                         next()
//                     })
//                 }
//                 else {
//                     console.log('ไม่พบข้อมูลผู้ใช้งาน')
//                     res.status(200).json(error_message.err_update_not_found)
//                 }
//             })

//         }
//         else {
//             console.log('ooo', req.body.image_profile)
//             db.query('SELECT*FROM user_login WHERE user_id = ?', req.body.user_id, (err, result) => {
//                 if (err) throw err;
//                 if (result[0]) {
//                     db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.body.user_id], (err) => {
//                         if (err) throw err;
//                         else {
//                             fs.writeFile(`./image/user/user_${req.body.user_id}.png`, req.body.image_profile.slice(23), 'base64', (err, data) => {
//                                 if (err) throw err;
//                                 let image_profile = 'user_app/image/user_' + req.body.user_id + '.png'
//                                 db.query('UPDATE user_login SET image_profile=? WHERE user_id = ?', [image_profile, req.body.user_id], (err, result) => {
//                                     console.log('re', req.body.user_id)
//                                     if (err) throw err;
//                                     console.log('อัพเดทข้อมูลสำเร็จ')
//                                     next()
//                                 })
//                             })
//                         }
//                     })
//                 }
//                 else {
//                     console.log('ไม่พบข้อมูลผู้มช้งาน')
//                     res.status(200).json(error_message.err_update_not_found)
//                 }
//             })
//         }

        // db.query('SELECT*FROM user_login WHERE user_id = ?', req.user_id, (err, result) => {
        //     if (err) throw err
        //     console.log('reees',result)
        //     if (result[0]) {
        //         db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.user_id], (err, result) => {
        //             if (err) throw err;
        //             else {
        //                 req.result = result
        //                 console.log('อัพเดทสำเร็จ')
        //                 next()
        //             }
        //         })
        //     }
        //     else {
        //         console.log('ไม่พบข้อมูลผู้ใช้งาน')
        //         res.status(200).json(error_message.err_update_not_found)
        //     }
        // })

//     }
// }

exports.update_user_person = () => {
    return (req, res, next) => {
        let update_data = {
            user: req.body.user,
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            phone_number: req.body.phone_number,
            user_type: req.body.user_type
        }

    console.log('id',req.body.user_id)
        db.query('SELECT * FROM user_login WHERE user_id = ?', req.body.user_id, (err, result) => {
            if (err) throw err
            console.log('reees',result)
            if (result[0]) {
                db.query('UPDATE user_login SET ? WHERE user_id = ?', [update_data, req.body.user_id], (err, Setresult) => {
                    if (err) throw err;
                    else {
                        req.result = Setresult
                        console.log('ss',req.result)
                        console.log('อัพเดทสำเร็จ')
                        next()
                    }
                })
            }
            else {
                console.log('ไม่พบข้อมูลผู้ใช้งาน')
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
            phone_number: req.body.phone_number,
            user_type:req.body.user_type,
            personal_id: req.body.personal_id,
            name_eng: req.body.name_eng,
            last_name_eng: req.body.last_name_eng,
            dob: req.body.dob,
            gender: req.body.gender
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

exports.get_user_edit = () => {
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

// exports.user_validd = () => {
//     return (req, res, next) => {
//         db.query('SELECT*FROM user_login WHERE user_id = ? ', req.user_id, (err, result) => {
//             if (err) throw err
//             else {
//                 req.result = result
//                 next()
//             }
//         })
//     }
// }

exports.user_person = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM user_login WHERE user_id = ? '
        db.query(sql, req.body.user_id, (err, result) => {
            if (err) throw err;
            else {
                req.result = result[0]
                next()
            }
        })
    }
}



exports.get_user_update = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM user_login WHERE user_id=?'
        db.query(sql, req.body.user_id, (err, result) => {
            if (err) throw err;
            else {
                req.result = result[0]
                next()
            }
        })
    }
}


exports.login = () => {
    return (req, res, next) => {
        db.query('SELECT * FROM `user_login` WHERE user= ?', req.body.user, (err, result) => {
            if (err) throw err;
                if(result[0].user_type=='1'||result[0].user_type=='2'){
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

                }else
                res.status(200).json(error_message.user_work_not_found)
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
                    let pass_update = {password: encrypt.encrypt(req.body.new_password)
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
