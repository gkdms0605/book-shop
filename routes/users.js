const express = require('express');
const {body, param, validationResult} = require("express-validator");
const router = express.Router();

router.use(express.json());

// 회원가입
router.post('/join', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().isString().withMessage("비밀번호 확인 필요")
    ], (req, res) => {
        let {email, password} = req.body;
    
        res.json("회원가입");
})

// 로그인
router.post('/login', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().isString().withMessage("비밀번호 확인 필요")
    ], (req, res) => {
        let {email, password} = req.body;
        res.json("로그인");
})

router
// 비밀번호 초기화 요청
    .route('/reset')
    .post(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인 필요")
        ], (req, res) => {
            let {email} = req.body;
            res.json("초기화 요청");
    })

// 비밀번호 초기화
    .put(
        [
            body('password').notEmpty().isString().withMessage("비밀번호 확인 필요")
        ], (req, res) => {
            let {password} = req.body;
            res.json("초기화");
        }
    )

module.exports = router;