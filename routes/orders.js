const express = require("express");
const router = express.Router();

router.use(express.json());

router
    .route('/')
    .post((req, res) => {
        res.json("주문하기");
    })

    .get((req, res) => {
        res.json("주문 조회");
    })

router.get('/:id', (req, res) => {
    res.json("주문 상세 조회");
})

module.exports = router