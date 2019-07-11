var express = require('express')
var router=express.Router()
var controler= require('../controller/control')
var validate = require('../controller/validate')
// var image = require ('../controller/image_control')

router.post('/new_file',
    controler.new_file(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'สร้างไฟล์สำเร็จ'
        })
    }
)
router.post('/cop_text',
    controler.cop_text(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'สร้างไฟล์ใหม่พร้อมเขียน'
        })
    }
)

router.post('/read_img',
    controler.read_img(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            // result:req.result,
            result2:req.result2
        })
    }
)



router.post('/write_file',
    controler.write_file(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'เขียนไฟล์สำเร็จ',
            result:req.result
        })
    }
)

router.post('/read_file',
    controler.read_file(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            result:req.result
        })
    }
)

router.get('/show_user',
    controler.show_user(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            result:req.result
        })
    }
),
router.get('/user_valid',
    validate.validate_token(),
    controler.user_valid(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            result:req.result
        })
    }
),
router.post('/update_user',
    validate.validate_update_user_data(),
    validate.validate_token(),
    controler.update_user(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'อัพเดทได้แล้ว'
        })
    }
),

router.post('/update_password',
    validate.validate_update_password(),
    validate.validate_token(),
    controler.update_password(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'เปลี่ยนรหัสผ่านแล้วนะจ๊ะ'
        })
    }
),

router.post('/user_login',
    validate.validate_user_login(),
    controler.login(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            token:req.token,
            message:'มึงมาเจอกูไอ้เฟิร์ส'
        })
    }
),

router.post('/register',
    validate.validate_user_register(),
    controler.add_register(),
    (req,res)=>{
        res.status(200).json({
            success:true,
            message:'สมัครสมาชิกสำเร็จ'
        })
    }
),

module.exports=router