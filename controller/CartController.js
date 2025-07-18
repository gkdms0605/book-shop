const { conn } = require('../mariadb');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth');
const {StatusCodes} = require('http-status-codes');

const addToCart = (req, res) => {
    let {book_id, quantity} = req.body;
    let authorization = ensureAuthorization(req, res);
    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {
        let sql = `INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)`;
        let values = [authorization.id, book_id, quantity];

        conn.query(sql, values, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
}

const getCartItems = (req, res) => {
    let {selected} = req.body;
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON books.id = cartItems.book_id WHERE user_id = ?`;
        let values = [authorization.id];

        if (selected) {
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

        conn.query(sql, values, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            results.map(function(result) {
                result.bookId = result.book_id;
                delete result.book_id;
            })
            return res.status(StatusCodes.OK).json(results);
        })
    }    
}

const removeCartItems = (req, res) => {
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {
        let cartItemid = req.params.id;
        let sql = `DELETE FROM cartItems WHERE id = ?`;
        
        conn.query(sql, cartItemid, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0){
                return res.status(StatusCodes.NOT_FOUND).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
    }
}

const updateCartItems = (req, res) => {
    let cartItemid = req.params.id;
    let authorization = ensureAuthorization(req);

    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 
    else {
        let sql = `UPDATE cartItems SET id = ? AND user_id = ?`;
        let values = [cartItemid, authorization.id];

        conn.query(sql, values, (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0){
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
}

module.exports = {addToCart, getCartItems, removeCartItems, updateCartItems};