var express = require('express')
var router = express.Router()
var product_controlor = require('../controller/product_controlor')
var validate = require('../controller/product_validate')

// router.post('/show_product',
//     controler.show_product(),
//     (req,res)=>{
//         res.status(200).json({
//             success:true,
//             result:req.result
//         })
//     }
// ),
router.get('/get_product',
    product_controlor.get_product(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.get('/get_product_sell',
    product_controlor.get_product_sell(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.get('/get_course_sell',
    product_controlor.get_course_sell(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)


router.post('/get_product_update',
    product_controlor.get_product_update(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/add_product',
    validate.validate_add_product(),
    product_controlor.add_product(),
    (req, res) => {
        res.status(200).json({
            success: true,
            // message:'เพิ่มสินค้าสำเร็จ'
        })
    }
),

    router.post('/delete_product',
        product_controlor.delete_product(),
        (req, res) => {
            res.status(200).json({
                success: true,
                message: 'ลบสินค้าสำเร็จ',
            })
        }
    ),


    router.post('/get_slip_product',
        product_controlor.get_slip_product(),
        (req, res) => {
            res.status(200).json({
                success: true,
                result: req.result
            })
        }
    )


router.post('/get_detail_slip',
    product_controlor.get_detail_slip(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.get('/get_slip',
    product_controlor.get_slip(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    }
)

router.post('/update_product',
    // validate.validate_update_prpduct(),
    product_controlor.update_product(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'อัพเดทสำเร็จ'
        })
    }
),

    router.post('/slip_product',
        product_controlor.slip_product(),
        (req, res) => {
            res.status(200).json({
                success: true,
                message: 'เพิ่มใบเสร็จ'
            })
        }

    )



router.get('/image/:id',
    (req, res) => {
        require("fs").readFile(__dirname.replace("route", "") + 'image/product/' + req.params.id, (err, data) => {

            if (err !== null) {
                res.sendFile(__dirname.replace("route", "") + 'image/product_defult.png')
            } else {
                res.sendFile(__dirname.replace("route", "") + 'image/product/' + req.params.id)
            }

        })
    }
)

// router.get('/image/:id',
//     function (req, res) {

//         require("fs").readFile(__dirname.replace("route", "") + 'image/product/' + req.params.id, (err, data) => {

//             if(err!==null){
//                 res.sendFile(__dirname.replace("route", "") + 'image/default_product.png')
//             }else{
//             res.sendFile(__dirname.replace("route", "") + 'image/product/' + req.params.id)
//             }

//         })

//     })

module.exports = router