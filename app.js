if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const  ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const {campgroundSchema , reviewSchema} = require('./schemas')

const app = express();

const userRouters = require('./routes/users');
const campgroundRouters = require('./routes/campgrounds');
const reviewRouters = require('./routes/reviews');


//デフォルトのejsのエンジンではなく、ejsMateをつかってくださいという指示
app.engine('ejs', ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname, 'views'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig ={
    secret:'mysecret',
    resave:false,
    saveUninitialized:true,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({
    contentSecurityPolicy:false

}
));

// const scriptSrcUrls = [
//     'https://api.maptiler.com',
//     'https://cdn.jsdelivr.net'
// ];
// const styleSrcUrls = [
//     'https://api.maptiler.com',
//     'https://cdn.jsdelivr.net',
//     'https://fonts.googleapis.com'
// ];
// const connectSrcUrls = [
//     'https://api.maptiler.com',
//     'https://*.maptiler.com',
// ];
// const fontSrcUrls = [
//     'https://fonts.gstatic.com'
// ];
// const imgSrcUrls = [
//     `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
//     'https://images.unsplash.com',
//     'https://*.maptiler.com',
//     'https://tile.openstreetmap.org'
// ];

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: [],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", "blob:"],
//         childSrc: ["blob:"],
//         objectSrc: [],
//         imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
//         fontSrc: ["'self'", ...fontSrcUrls]
//     }
// }));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    //console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// app.use((req, res, next) => {
//     console.log('--- SESSION DEBUG ---');
//     console.log('PATH:', req.path);
//     console.log('METHOD:', req.method);
//     console.log('SESSION ID:', req.sessionID);
//     console.log('SESSION:', req.session);
//     next();
// });

//test DBをさしている
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://localhost:27017/yelp-camp', 
    {useNewUrlParser: true, 
        useUnifiedTopology: true ,
        useCreateIndex : true,
        useFindAndModify:false})
.then(()=>{
    console.log('MongoDB接続OK');
})
.catch(err=>{
    console.log('MongoDB接続エラー');
    console.log(err);

})



const validateReview = (req, res, next) => {
    console.log("validateReview!!!", req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/' , (req, res)=>{
    //res.send('YelpCamp!!!!')
    res.render('home');
});

// app.get('/fakeUser' , async(req, res)=>{    
//     const user = new User({email:'tame@example.com' , username:'tame'});
//     const newUser = await User.register(user , 'mogegege');
//     res.send(newUser);
// });

app.get('/makeCampground' , catchAsync(async(req, res)=>{
    const camp = new Campground({
        title:'私の庭',
        description:'気軽に安くキャンプ'
    });
    await camp.save();
    res.send(camp);
}));

app.use('/' , userRouters);
app.use('/campgrounds' , campgroundRouters);
app.use('/campgrounds/:id/reviews' , reviewRouters);


//review関連

//エラーになるので使えなかった→Express4系ではつかえる
// app.all('*', (req, res,next)=>{
// res.send('404!!!');
// })

// app.all(/.*/, (req, res, next) => {
//   //res.status(404).send('404!!!');
//   next( new ExpressError("ページが見つかりませんでした" , 404));
// });

app.use((err, req , res , next)=>{
    console.log("---e---");
    console.log(err.statusCode);
    console.log(err.message);
    const {statusCode=500 } = err;
    if(!err.message) {
        err.message = '問題が発生!!!!'
    }
    //res.status(statusCode).send(message);
    res.render('campgrounds/error' ,  {err} );
})


app.listen(8080 , ()=>{
    console.log('ポート8080でリクエスト待ち受け中・・・')
});
