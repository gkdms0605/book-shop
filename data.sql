INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2025-03-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2024-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2025-02-28");


SELECT * FROM books LEFT JOIN category ON books.category_id = category.id;
SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = 1;


INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩팥..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2023-12-07");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2023-10-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2025-03-13");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2025-03-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2025-02-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2025-01-15");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2025-02-28");


-- 좋아요 관리
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (3, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (4, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5);

DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 3;

SELECT COUNT(*) FROM Bookshop.likes WHERE liked_book_id = 1;

SELECT *, (SELECT COUNT(*) FROM Bookshop.likes WHERE liked_book_id = books.id) AS likes FROM books;

SELECT *, 
(SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
(SELECT EXISTS (SELECT * FROM likes WHERE user_id = 1 AND liked_book_id = 1)) AS liked 
FROM books LEFT JOIN category ON books.category_id = category.id
WHERE books.id = 1;

-- 장바구니 관리
INSERT INTO cartItems (user_id, book_id, quantity) VALUES (1, 1, 1);
INSERT INTO cartItems (user_id, book_id, quantity) VALUES (1, 1, 1);
INSERT INTO cartItems (user_id, book_id, quantity) VALUES (1, 1, 1);
INSERT INTO cartItems (user_id, book_id, quantity) VALUES (1, 1, 1);

SELECT cartItems.id, book_id, title, quantity, user_id FROM cartItems LEFT JOIN books ON books.id = cartItems.book_id

DELETE FROM cartItems WHERE id = ?;

SELECT * FROM cartItems WHERE user_id = 1 AND id IN (1, 3);

-- 배송 정보
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 중구", "김송아", "010-1234-5678");
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 서초구", "김송송", "010-5555-5555");

-- 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES ("어린왕자들", 3, 600000, 1, 1);

-- 주문 상세 목록
INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (1, 1, 1);
INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (1, 3, 2);

SELECT MAX(id) FROM orderedBook;
SELECT last_insert_id();

-- 결제된 도서 장바구니에서 삭제
DELETE FROM cartItems WHERE id IN (1, 2, 3);

-- 개별 주문 목록 조회
SELECT orders.id, created_at, address, receiver, contact, book_title, total_price, total_quantity 
FROM orders JOIN delivery ON orders.delivery_id = delivery.id;  