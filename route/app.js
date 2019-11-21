var express = require('express')
var router = express.Router()
var controlor = require('../controller/app')
var validateUtil = require('../controller/validate')



router.post('/add_gym',
    controlor.validate_add_gym(),
    controlor.add_gym(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'เพิ่มข้อมูลยิมสำเร็จ !'
        })
    }
),


    router.get('/get_gym',
        controlor.get_gym(),
        (req, res) => {
            res.status(200).json({
                success: true,
                result: req.result
            })
        }
    ),


    router.get('/notification_book',
        controlor.notification_book(),
        (req, res) => {
            res.status(200).json({
                success: true,
                result: req.result
            })
        }
    ),

    router.post('/get_book',
        // validateUtil.validate_token(),
        controlor.get_book(),
        (req, res) => {
            res.status(200).json({
                success: true,
                result: req.result
            })
        }
    ),

    router.post('/add_account',
        controlor.add_account(),
        (req, res) => {
            res.status(200).json({
                success: true,
                message: 'เพิ่มบัญชีธนาคารสำเร็จ'
            })
        }
    ),

    router.post('/update_account',
        controlor.update_account(),
        (req, res) => {
            res.status(200).json({
                success: true,
                message: 'อัพเดทบัญชีธนาคารสำเร็จ'
            })
        }
    )

router.get('/show_account',
    validateUtil.validate_token(),
    controlor.show_account(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    })


router.post('/get_update_account',
    controlor.get_update_account(),
    (req, res) => {
        res.status(200).json({
            success: true,
            result: req.result
        })
    })

router.post('/delete_account',
    controlor.delete_account(),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'ลบบัญชีธนาคารสำเร็จ',
        })
    }
),



    module.exports = router