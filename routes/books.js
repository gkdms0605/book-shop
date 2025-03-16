const express = require('express');
const router = express.Router();
const {allBooks, bookDetail} = require('../controller/BookController');

router.use(express.json());

// 중복 URL이 생길 경우 코드 순서대로 우선 순위가 결정됨.
router.get('/', allBooks);  // 전체 도서 조회 | 카테고리 id별 전체 조회
router.get('/:id', bookDetail);

module.exports = router;