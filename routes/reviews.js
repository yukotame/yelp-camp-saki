
const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { isLoggedIn , ValidateReview  ,isReviewAuthor} = require('../middleware');


router.post('/',  isLoggedIn , ValidateReview , catchAsync(reviews.createReview));

router.delete('/:reviewId',  isLoggedIn, isReviewAuthor ,  catchAsync(reviews.deleteReview));

// これがないと他のファイルからこのrouterを使えない
module.exports = router;