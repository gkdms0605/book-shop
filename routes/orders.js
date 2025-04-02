const express = require("express");
const router = express.Router();
const {addOrder, getOrderList, getOrderById} = require('../controller/OrderController');

router.use(express.json());

router
    .route('/')
    .post(addOrder)
    .get(getOrderList)

router.get('/:id', getOrderById)

module.exports = router;