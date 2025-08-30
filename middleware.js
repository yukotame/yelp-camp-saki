const ExpressError = require('./utils/ExpressError');
const {campgroundSchema , reviewSchema} = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
   //console.log('req.user:' , req.user);
   if(!req.isAuthenticated()){
       req.session.returnTo = req.originalUrl;

       console.log(" isLoggedIn!!!" , req.session.returnTo);
        req.flash('error' , 'ログインしてください');
        return res.redirect('/login')

    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports. ValidateCampground = (req , res , next)=>{
        const {error} = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(detail => detail.message).join(',');
            throw new ExpressError(msg , 400);
        }else{
            next();
        }
        console.log('---ValidateCampground----');        
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    const {reviewId , id} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.ValidateReview = (req , res , next)=>{

        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(detail => detail.message).join(',');
            throw new ExpressError(msg , 400);
        }else{
            next();
        }
        console.log('---ValidateReview----');
        
}