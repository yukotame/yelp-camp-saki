const User= require('../models/user');

module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.register = async(req, res, next)=>{
    try{
        const {email , username , password} = req.body;
        const user = new User({email , username});
        const registerdUser = await User.register(user , password);
        console.log(registerdUser);
        req.login(registerdUser , err=>{
            if(err) return next(err);
            req.flash('success' , 'YelpCampへようこそ');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
// res.send(req.body);
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login =  (req, res) => {
    // console.log("=== POST /login ===");
    // console.log("Session ID:", req.sessionID);
    // console.log("Session:", req.session);
    // console.log("req.session.returnTo:", req.session.returnTo);

    const redirectUrl = res.locals.returnTo || '/campgrounds';

    req.flash('success', 'YelpCampへようこそ');
    res.redirect(redirectUrl);
}


module.exports.logout = async(req , res)=>{

//   req.logout();  // ←これがエラーの原因
//   req.flash('success', 'ログアウトしました');
//   res.redirect('/campgrounds');
    req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'ログアウトしました');
    res.redirect('/campgrounds');
    })
}