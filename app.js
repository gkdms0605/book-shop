const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: __dirname + "/.env"});
app.listen(process.env.PORT);

const UserRouter = require('./routes/users');
const BookRouter = require('./routes/books');
const CategoryRouter = require('./routes/category');
const LikeRouter = require('./routes/likes');
const CartRouter = require('./routes/carts');
const OrderRouter = require('./routes/orders');

app.use(cors({
  origin: 'http://localhost:3000',  // 프론트엔드 주소
  credentials: true                // 쿠키 포함 요청 허용
}));

app.use(cookieParser());

app.use("/users", UserRouter);
app.use("/books", BookRouter);
app.use("/category", CategoryRouter);
app.use("/likes", LikeRouter);
app.use("/carts", CartRouter);
app.use("/orders", OrderRouter);