const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/CatchAsync');
//const Campground = require('../models/campground');
const { isLoggedIn , isAuthor , ValidateCampground } = require('../middleware');
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const {storage} = require('../cloudinary');
const upload =   multer({ storage })




router.route('/')
.get(catchAsync(campgrounds.index))
.post( isLoggedIn,  upload.array('image') , ValidateCampground ,catchAsync(campgrounds.createCampground))
// .post( upload.array('image'), (req,res) =>{
//     console.log(req.body , req.files);
//     res.send("受け付けました");
// })

router.get('/new' , isLoggedIn , campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,  upload.array('image') , ValidateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.get('/' , catchAsync(campgrounds.index));
router.get('/:id/edit' , isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;