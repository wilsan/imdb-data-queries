const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user');

router.get('/', (req, res) => {
   res.render('login');
});

router.post('/', async (req, res, next) => {
   const { username, password, action } = req.body;
   if (action === 'Register') {
      const user = new User({ username });
      const regiseteredUser = await User.register(user, password);
      req.login(regiseteredUser, err => {
         if (err)
            return console.log(err);

         req.flash('success', 'You are now authenticated!');
         res.redirect('/');
      });
   } else if (action === 'Login') {
      next();
   }
},
   passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      keepSessionInfo: true
   }),
   (req, res) => {
      res.redirect('/');
   })

module.exports = router;
