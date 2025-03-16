const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config({path: __dirname + "/.env"});
app.listen(process.env.PORT);

const UserRouter = require('./routes/users');
const BookRouter = require('./routes/books');
const CategoryRouter = require('./routes/category');
const LikeRouter = require('./routes/likes');
const CartRouter = require('./routes/carts');
const OrderRouter = require('./routes/orders');

app.use("/users", UserRouter);
app.use("/books", BookRouter);
app.use("/category", CategoryRouter);
app.use("/likes", LikeRouter);
app.use("/carts", CartRouter);
app.use("/orders", OrderRouter);