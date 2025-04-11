const mariadb = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const conn = mariadb.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true
});

const dbQuery = (sql, values) => { // 모듈화는 했지만 사용은 아직..
    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return err;
        }
        
        else {
            return results;
        }
    }) 
}

module.exports = {conn, dbQuery};