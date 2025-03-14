const express = require('express');
const router = express.Router();

router.use(express.json());

router
    .route('/:id')

    .post((req, res) => {
        res.json("좋아요");
    })

    .delete((req, res) => {
        res.json("좋아요 취소");
    })

module.exports = router;