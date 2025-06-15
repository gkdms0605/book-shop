const { conn } = require('../mariadb');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/../.env'})

const {StatusCodes} = require('http-status-codes');

const join = (req, res) => {
    let {email, password} = req.body;

    let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    
    // 회원 가입 시 DB에 암호화된 비밀번호와 salt 값을 같이 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    console.log(hashPassword);

    // 로그인 시 DB에서 salt 값을 꺼낸 후 클라이언트에게 받은 비밀번호를 암호화 (DB 비밀번호 비교)

    let values = [email, hashPassword, salt];
    conn.query(sql, values, ((err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.affectedRows) {
            return res.status(StatusCodes.CREATED).json(results);
        }

        else {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }))
};

const login = (req, res) => {
    let {email, password} = req.body;
    let sql = `SELECT * FROM users WHERE email = ?`;

    conn.query(sql, email, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        let loginUser = results[0]; 

        // salt값 꺼낸 후 입력받은 비밀번호 암호화 -> DB 비밀번호와 비교
        const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

        if(loginUser && loginUser.password == hashPassword){
            const token = jwt.sign({
                id: loginUser.id, 
                email: loginUser.email,
                password: loginUser.password
            }, process.env.PRIVATE_KEY, {
                expiresIn: '3m',
                issuer: 'haeun'
            })
    
            res.cookie("token", token), {
                httpOnly: true
            }
    
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
};

const requestPasswordReset = (req, res) => {
    let {email} = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`;

    conn.query(sql, email, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        } 

        const user = results[0];
        
        if(user){
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
};

const passwordReset = (req, res) => {
    let {email, password} = req.body;

    let sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?;`
    
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.affectedRows == 0){
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

module.exports = {join, login, requestPasswordReset, passwordReset};