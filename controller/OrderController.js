// const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host:'127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;
    let delivery_id;
    let order_id;

    // delivery 테이블 삽입
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact]
    
    let [results] = await conn.execute(sql, values);
    delivery_id = results.insertId;

    // orders table 삽입
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.execute(sql, values);
    order_id = results.insertId;

    // 입력받은 cart id를 바탕으로 장바구니 정보 불러오기
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]);

    console.log(orderItems);

    // orderedBook table 삽입
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`
    
    // items.. -> foreach를 통해 각 요소들을 꺼낸 후 valuse(이중 배열)에 저장 
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    })

    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
}

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;

    let result = await conn.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host:'127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    let {user_id} = req.body;
    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price FROM orders JOIN delivery ON orders.delivery_id = delivery.id;  `
    
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows)
} 

const getOrderDetail = async (req, res) => {
    const {id} = req.params;
    const conn = await mariadb.createConnection({
        host:'127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    let sql = `SELECT book_id, title AS book_title, author, price, quantity FROM orderedBook JOIN books ON book_id = books.id WHERE order_id = ?`
    let [rows, fields] = await conn.query(sql, [id]);

    return res.status(StatusCodes.OK).json(rows);
}

module.exports = {addOrder: order, getOrderList: getOrders, getOrderById: getOrderDetail};