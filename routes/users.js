const express = require('express');
const {body, param, validationResult} = require('express-validator');
const conn = require('../mariadb')
const router = express.Router();
const {join, login, requestPasswordReset, passwordReset} = require('../controller/UserController')

router.use(express.json());

function validate(req, res, next){
    const err = validationResult(req);

    if(err.isEmpty()){
        return next();
    } else {
        res.status(StatusCodes.BAD_REQUEST).json(err.array());
    }
} 

// 회원가입
router.post('/join', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().withMessage("비밀번호 확인 필요"),
        validate
    ], join);

// 로그인
router.post('/login', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().isString().withMessage("비밀번호 확인 필요")
    ], login);

router
// 비밀번호 초기화 요청
    .route('/reset')
    .post(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인 필요")
        ], requestPasswordReset)

    .put(   // 비밀번호 초기화
        [
            body('password').notEmpty().withMessage("비밀번호 확인 필요")
        ], passwordReset)

module.exports = router;