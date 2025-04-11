const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const {conn, dbQuery} = require('../mariadb');

const allBooks = (req, res) => {
    let allBooksRes = {};
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
        }
        
        console.log(results);

        if(results.length) {
            results.map(function(result) {
                result.categoryId = result.category_id;
                result.pubDate = result.pub_date;

                delete result.category_id;
                delete result.pub_date;
            });
            allBooksRes.books = results;
        }
        else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })

    let [err, results] = dbQuery(sql, values);

    if (results) {
        return res.status(StatusCodes.OK).json(results)
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }

    sql = `SELECT count(*) FROM books`;
    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        let pagenation = {};
        pagenation.currentPage = parseInt(currentPage);
        pagenation.totalCount = results[0]["count(*)"];

        allBooksRes.pagenation = pagenation;

        return res.status(StatusCodes.OK).json(allBooksRes);
    })
}

const bookDetail = (req, res) => {
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
    } 
    else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
    } 

    let book_id = req.params.id;
    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked 
                FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;

    if (authorization instanceof ReferenceError) {
        sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;
        values = [book_id];
    }

    conn.query(sql, values, (err, results) => {
        if(err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results[0]){
            results.map(function(result) {
                result.categoryId = result.category_id;
                result.pubDate = result.pub_date;

                delete result.category_id;
                delete result.pub_date;
            });
            return res.status(StatusCodes.OK).json(results);
        }
        else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
};

module.exports = {allBooks, bookDetail};