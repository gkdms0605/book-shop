const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.json("책 전체 조회");
})

router.get('/:id', (req, res) => {
    let {id} = req.params;
    res.json(`id별 책 상세조회 ${id}`);
})

router.get('/', (req, res) => {
    res.json("메인 페이지")
})

module.exports = router;