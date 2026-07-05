const express = require('express');
const router = express.Router();
const getRoutes = require('./get');
const postRoutes = require('./post');
const deleteRouter = require('./delete');
const categoriesRoutes = require('./categories');

router.use(getRoutes);
router.use(postRoutes);
router.use(deleteRouter);
router.use(categoriesRoutes);

module.exports = router;