const Review = require('../models/review');
const Campground = require('../models/campground');
module.exports.createReview =async (req, res) => {
    console.log("リクエストボディ" , req.body);
    console.log("リクエストパラム" , req.params);   
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);    
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'レビューを登録しました！');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview =
async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'レビューを削除しました！');
    res.redirect(`/campgrounds/${id}`);
}