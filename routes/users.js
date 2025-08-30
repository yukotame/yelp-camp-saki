const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout' , users.logout);

// router.post('/login',passport.authenticate('local' , {failureFlash:true , failureRedirect: '/login' }), (req, res)=>{
//  //res.send('success!!');
//  console.log("req.session.returnTo" ,req.session.returnTo);
//  const redirectUrl = req.session.returnTo || '/campgrounds';
//  delete req.session.returnTo;
//  req.flash('success' , 'YelpCampへようこそ');
//  res.redirect(redirectUrl);
// })


// router.post('/login', (req, res)=>{
//  res.send('success');
// })


module.exports = router;