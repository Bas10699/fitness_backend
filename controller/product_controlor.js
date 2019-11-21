var db = require('../connect/db_connect')
var encrypt = require('../const/encrypt')
var bcrypt = require('bcryptjs')
var jsonwebToken = require('jsonwebtoken')
var testfile = 'testfile.txt'
var error_message = require('../const/error_message')
var fs = require('fs')


exports.get_product = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM detail_product'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}


exports.get_product_sell = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM detail_product WHERE type_product != "4"'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}


exports.get_course_sell = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM detail_product WHERE type_product = "4"'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}

exports.get_product_update = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM detail_product WHERE id_product=?'
        db.query(sql, req.body.id_product, (err, result) => {
            if (err) throw err;
            else {
                req.result = result[0]
                next()
            }
        })
    }
}

exports.delete_product = () => {
    return (req, res, next) => {
        // res.status(200).json({
        //     success:false,
        //     error_message:"ควย! ไม่ให้ลบ"
        // })
        db.query('DELETE FROM detail_product WHERE id_product = ?', req.body.id_product, (err, result) => {
            if (err) throw err;
            else {
                fs.unlink(`./image/product/product_${req.body.id_product}.png`, (err) => {
                    if (err) throw err;
                    else {
                        req.result = result
                        next()
                    }
                });

            }
        })
    }
}




exports.add_product = () => {
    return (req, res, next) => {

        var data = {
            id_product: null,
            name_product: req.body.name_product,
            price_product: req.body.price_product,
            capital_price_product: req.body.capital_price_product,
            type_product: req.body.type_product,
            stock_product: req.body.stock_product,
            code_product: req.body.code_product,
            // image_product: `product/image/product_${req.body.id_product}.png`
        }
        console.log(data)
        db.query('INSERT INTO detail_product SET ? ', data, (err, result) => {
            console.log('re', result.insertId)
            if (err) throw err;
            fs.writeFile(`./image/product/product_${result.insertId}.png`, req.body.image_product.slice(23), 'base64', (err, data) => {
                // db.query('UPDATE INTO detail_product SET ? ', data, 
                let image_product = 'product/image/product_' + result.insertId + '.png'
                db.query('UPDATE detail_product SET image_product=? WHERE id_product = ?', [image_product, result.insertId], (err, result) => {
                    console.log('re', result.insertId)
                    if (err) throw err;
                })
                if (err) throw err;
                next()
            })
            next()
        })
    }
}

exports.update_product = () => {
    return (req, res, next) => {
        console.log('ss', req.body)
        let update_product = {
            name_product: req.body.name_product,
            price_product: req.body.price_product,
            type_product: req.body.type_product,
            capital_price_product: req.body.capital_price_product,
            stock_product: req.body.stock_product,
            code_product: req.body.code_product,
            // image_product: 'product/image/product_'+req.body.id_product+'.png'
        }
        if (req.body.image_product === `product/image/product_${req.body.id_product}.png`) {
            db.query('SELECT*FROM detail_product WHERE id_product = ?', req.body.id_product, (err, result) => {
                if (err) throw err;
                if (result[0]) {
                    db.query('UPDATE detail_product SET ? WHERE id_product = ?', [update_product, req.body.id_product], (err) => {
                        if (err) throw err;
                        req.result = result
                        console.log('อัพเดทข้อมูลสำเร็จ')
                        next()
                    })
                }
                else {
                    console.log('ไม่พบข้อมูลผู้มช้งาน')
                    res.status(200).json(error_message.err_update_not_found)
                }
            })

        }
        else {
            console.log('ooo', req.body.image_product)
            db.query('SELECT*FROM detail_product WHERE id_product = ?', req.body.id_product, (err, result) => {
                if (err) throw err;
                if (result[0]) {

                    db.query('UPDATE detail_product SET ? WHERE id_product = ?', [update_product, req.body.id_product], (err) => {
                        if (err) throw err;
                        else {
                            fs.writeFile(`./image/product/product_${req.body.id_product}.png`, req.body.image_product.slice(23), 'base64', (err, data) => {
                                if (err) throw err;
                                let image_product = 'product/image/product_' + req.body.id_product + '.png'
                                db.query('UPDATE detail_product SET image_product=? WHERE id_product = ?', [image_product, req.body.id_product], (err, result) => {
                                    console.log('re', req.body.id_product)
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

exports.slip_product = () => {
    return (req, res, next) => {
        let slip_product = {
            // order: req.body.order,
            sum_price_product: req.body.sum_price_product,
            get_price_product: req.body.get_price_product,
            change_price_product: req.body.change_price_product
        }
        console.log('sss', slip_product)
        db.query('INSERT INTO slip SET ?', slip_product, (err, result) => {
            if (err) throw err
            if (result) {
                req.body.order.map((order_element, order_index) => {
                    let product = {
                        order_id: result.insertId,
                        name_product: order_element.name_product,
                        code_product: order_element.code_product,
                        // date_product: order_element.date_product,
                        type_product: order_element.type_product,
                        quantity_product: order_element.get_quantity,
                        price_product: order_element.price_product,
                    }

                    console.log('product', product)
                    db.query('INSERT INTO slip_sell SET ?', product, (err, result_order) => {
                        if (err) throw err;
                        next()
                    })
                })

            }
            else
                console.log('พบข้อผิดพลาด')
        })
    }
}

exports.get_slip = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM slip'
        db.query(sql, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}



exports.get_detail_slip = () => {
    return (req, res, next) => {
        // console.log(req.body)
        db.query('SELECT * FROM slip WHERE order_id=?',req.body.order_id, (err, result) => {
            if (err) throw err;
            else {
                req.result = result[0]
                next()
            }
        })
    }
}


exports.get_slip_product = () => {
    return (req, res, next) => {
        let sql = 'SELECT * FROM slip_sell WHERE order_id = ?'
        db.query(sql,req.body.order_id, (err, result) => {
            if (err) throw err;
            else {
                req.result = result
                next()
            }
        })
    }
}





// exports.update_product = () => {
//     return (req, res, next) => {
//         let update_product = {
//             name_product: req.body.name_product,
//             price_product: req.body.price_product,
//             type_product: req.body.type_product,
//             capital_price_product: req.body.capital_price_product,
//             stock_product: req.body.stock_product,
//             code_product: req.body.code_product,
//             // image_product: 'product/image/product_'+req.body.id_product+'.png'
//         }
//         db.query('SELECT*FROM detail_product WHERE id_product = ?', req.body.id_product, (err, result) => {
//             if (err) throw err;
//             if (result[0]) {
//                 let image_product = result[0].image_product
//                 if(image_product!= (image_product).toString('base64')){
//                     fs.unlink(`./image/product/product_${req.body.id_product}.png`, (err) => {
//                         if (err) throw err;
//                     })
//                 }
//                 db.query('UPDATE detail_product SET ? WHERE id_product = ?', [update_product, req.body.id_product], (err, result) => {
//                     if (err) throw err;
//                     else {
//                         req.result = result
//                         console.log('อัพเดทข้อมูลสำเร็จ')
//                         next()
//                     }
//                 })
//             }
//             else {
//                 console.log('ไม่พบข้อมูลผู้มช้งาน')
//                 res.status(200).json(error_message.err_update_not_found)
//             }
//         })

//     }
// }


// exports.add_product = () => {
//     return (req, res, next) => {
//         fs.readFile("D:/fitnesspos/fitness/image/test.jpg", (err, data) => {
//             if (err) throw err
//             else {
//                 console.log(data)
//                 req.result = (data).toString('base64')

//                 if(req.result){
//                     if (err) throw err
//                     else{
//                         fs.writeFile('./image/testee.jpg',req.result,'base64',(err,data)=>{
//                             next()
//                         })


//                     }
//                 }
//             }
//         })
//     }
// }

