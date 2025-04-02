const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addToCart = (req, res) => {
    let {book_id, quantity, user_id} = req.body;
    let sql = `INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)`;
    let values = [user_id, book_id, quantity];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
}

const getCartItems = (req, res) => {
    let {user_id, selected} = req.body;
    let sql = `SELECT cartItems.id, book_id, title, quantity, user_id FROM cartItems LEFT JOIN books ON books.id = cartItems.book_id WHERE user_id = ? AND cartItems.id IN (?)`;
    let values = [user_id, selected];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
}

const removeCartItems = (req, res) => {
    let {id} = req.params;
    let sql = `DELETE FROM cartItems WHERE id = ?`;
    
    conn.query(sql, id, (err, results) => {
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

const updateCartItems = (req, res) => {
    let {id} = req.params;
    let {user_id} = req.body;
    let sql = `UPDATE cartItems SET id = ? AND user_id = ?`;
    let values = [id, user_id];

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

module.exports = {addToCart, getCartItems, removeCartItems, updateCartItems};