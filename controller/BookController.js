const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { conn, dbQuery } = require('../mariadb');

const allBooks = async (req, res) => {
  try {
    let { category_id, news, limit = 3, currentPage = 0 } = req.query;
    let offset = currentPage == 0 ? 0 : limit * (currentPage - 1);

    let values = [];
    let condition = '';
    if (category_id && news) {
      condition = ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values = [category_id];
    } else if (category_id) {
      condition = ` WHERE category_id = ?`;
      values = [category_id];
    } else if (news) {
      condition = ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    const sql = `SELECT *, 
                        (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes 
                    FROM books ${condition} 
                    LIMIT ?, ?`;

    values.push(offset, parseInt(limit));
    const results = await dbQuery(sql, values);

    if (!results.length) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    results.forEach((result) => {
      result.categoryId = result.category_id;
      result.pubDate = result.pub_date;
      delete result.category_id;
      delete result.pub_date;
    });

    // 페이지네이션
    const countSql = `SELECT COUNT(*) as totalCount FROM books`;
    const countResult = await dbQuery(countSql, []);
    const totalCount = countResult[0].totalCount;

    return res.status(StatusCodes.OK).json({
      books: results,
      pagination: {
        totalCount: totalCount,
        currentPage: parseInt(currentPage),
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

const bookDetail = (req, res) => {
  const book_id = req.params.id;
  const authorization = ensureAuthorization(req, res);

  console.log(authorization);

  let sql = '';
  let values = [];

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).send("로그인 세션이 만료되었습니다. 다시 로그인 하세요.");
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).send("잘못된 토큰 값입니다. 다시 로그인 하세요.");
  }

  if (authorization && authorization.id) {
    sql = `
      SELECT 
        books.*, 
        category.*, 
        (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
        EXISTS (
          SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?
        ) AS liked
      FROM books
      LEFT JOIN category ON books.category_id = category.category_id
      WHERE books.id = ?;
    `;
    values = [authorization.id, book_id, book_id];
  }

  else {
    sql = `
      SELECT 
        books.*, 
        category.*, 
        (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes
      FROM books
      LEFT JOIN category ON books.category_id = category.category_id
      WHERE books.id = ?;
    `;
    values = [book_id];
  }

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results && results.length > 0) {
      const book = results[0];
      book.categoryId = book.category_id;
      book.pubDate = book.pub_date;
      delete book.category_id;
      delete book.pub_date;

      return res.status(StatusCodes.OK).json(book);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = { allBooks, bookDetail };