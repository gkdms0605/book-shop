const { conn } = require('../mariadb');
const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');


const addLike = (req, res) => {
    const book_id = req.params.id;
    // const {user_id} = req.body;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {    
        let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
        let values = [authorization.id, book_id];
        
        conn.query(sql, values, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
}

const removeLike = (req, res) => {
    const book_id = req.params.id;

    let authorization = ensureAuthorization(req, res);
    
    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
        let values = [authorization.id, book_id];
        conn.query(sql, values, (err, results)=> {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0){
                return res.status(StatusCodes.FORBIDDEN).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
}

module.exports = {addLike, removeLike};
