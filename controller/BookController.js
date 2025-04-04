const {StatusCodes} = require('http-status-codes');
const conn = require('../mariadb');

const allBooks = (req, res) => {
    let {category_id, news, limit = 3, currentPage = 0} = req.query;
    let offset = currentPage == 0 ? 0 : limit * (currentPage - 1);

    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books`;
    let values = [];

    if(category_id && news){    
        sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [category_id];
    }
    else if(category_id){
        sql += ` WHERE category_id = ?`;
        values = [category_id];
    }
    else if(news){
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }
    sql += ` LIMIT ?, ?`;
    console.log(offset, limit);
    values.push(offset, parseInt(limit));
    console.log(values);

    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.length) {
            return res.status(StatusCodes.OK).json(results);
        }

        else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
}

const bookDetail = (req, res) => {
    let {user_id} = req.body;
    let book_id = req.params.id;
    let values = [user_id, book_id, book_id];

    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked 
                FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;
    conn.query(sql, values, (err, results) => {
        if(err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results[0]){
            return res.status(StatusCodes.OK).json(results);
        }
        else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
};

module.exports = {allBooks, bookDetail};