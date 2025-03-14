const express = require('express');
const router = express.Router();

router.use(express.json());

router
    .route('/')
    .post((req, res) => {
        res.json("장바구니 담기 ");
    })

    .get((req, res) => {
        res.json("장바구니 조회");
    })

router.delete('/:id', (req, res) => {
    let {id} = req.params;
    res.json(`장바구니 삭제, ${id}`);
})

module.exports = router;