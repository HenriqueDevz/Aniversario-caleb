const express = require('express');
const router = express.Router();
const getRoutes = require('./get');
const postRoutes = require('./post');
const deleteRouter = require('./delete');

router.use(getRoutes);
router.use(postRoutes);
router.use(deleteRouter);

module.exports = router;