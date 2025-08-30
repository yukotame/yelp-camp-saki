const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');



module.exports.index = async(req, res)=>{
    //res.send('YelpCamp!!!!')
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds} );
}


module.exports.renderNewForm = (req, res) => {
    console.log("new!!!!!");
    res.render('campgrounds/new');
}

module.exports.showCampground = async(req, res)=>{
    //res.send('YelpCamp!!!!')
    console.log("campgrounds/:id");
    //const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log("campground.author" ,campground.author);
    if(!campground){
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
 
    res.render('campgrounds/show' , {campground } );
    //res.render('campgrounds/show' ,  {campground , msg: req.flash('success')} );
}


module.exports.createCampground = async(req, res, next)=>{
        //if(!req.body.campground) throw new ExpressError('不正なキャンプ場データです', 400)
    const maptilersdk = await import("@maptiler/sdk");

    maptilersdk.config.apiKey = process.env.MAPTILER_TOKEN;
    const address = req.body.campground.location;
    console.log("場所");
    console.log(address);
    const result = await maptilersdk.geocoding.forward(address, {
    language: "ja", // 日本語優先
    limit: 1        // 最大件数
    });

    // if (result.features.length > 0) {
    // const [lon, lat] = result.features[0].geometry.coordinates;
    // res.send(result.features[0].geometry);
    // } else {
    // console.log("場所が見つかりませんでした");
    // }

    // console.log("---------createCampground--------");
    // console.log(req.files);

    //res.send('OK!!!!');
    // console.log(req.user._id);
    //console.log(req.body.campground);

    const campground = new Campground(req.body.campground);
    campground.geometry =  result.features[0].geometry;
    campground.images = req.files.map(f =>({url : f.path , filename : f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', '新しいキャンプ場を登録しました！');
    res.redirect(`/campgrounds/${campground._id}`);

    //res.send(req.body);

}

module.exports.renderEditForm = async(req, res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  console.log(campground);
      if(!campground){
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campgrounds');
    }
   res.render('campgrounds/edit' ,  {campground} );
}

module.exports.updateCampground =async(req, res)=>{
    console.log(req.body);
//    res.send("PUT!!");
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground
  });
  console.log(campground);
  const imgs = req.files.map(f =>({url : f.path , filename : f.filename}));
  campground.images.push(...imgs);
  await campground.save();

  if(req.body.deleteImages){
    for (let filename of req.body.deleteImages) {
     await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull:{images:{ filename:{ $in :req.body.deleteImages}}}})
  }
  req.flash('success', 'キャンプ場を更新しました！');
  res.redirect(`/campgrounds/${campground._id}`);
  
}

module.exports.deleteCampground = async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'キャンプ場を削除しました！');
    res.redirect(`/campgrounds`);
}