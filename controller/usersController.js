const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/usersSchema');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}));


router.get('/',(req, res)=>{
    res.render("Authentication/SignIn");
});

router.get('/signup',(req, res)=>{
   res.render("Authentication/SignUp");
});

router.post('/signup', (req, res, next)=> {
    // req.session.isLoggedin = true;
    // res.redirect('../phonebook/list');
    const email = req.body.email;
    const passwd = req.body.passwd;
    Users.findOne({email: email})
        .then(user=>{
            if(!user){
                return res.redirect('/login');
            }
            bcrypt
                .compare(passwd, user.passwd)
                .then(doMatch =>{

                    if(doMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                             res.redirect('../phonebook/list');
                        });
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                   console.log(err);
                   res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
});

router.post('/', (req, res)=> {
    req.session.isLoggedin = true;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const passwd = req.body.passwd;
    Users.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/login');
            }
            return bcrypt
                .hash(passwd, 12)
                .then(hashPasswd => {
                    const users = new Users({
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        passwd: hashPasswd,

                    });
                    return users.save();
                });
        })

        .then(result => {
            res.redirect('../phonebook/list');
             transporter.sendMail({
                to: email,
                from: 'panku799@gmail.com',
                subject: 'Sign Up Succeed',
                html: '<h1>You Successfully signed up</h1>'
            });

        })
        .catch(err => {
            console.log(err);
        })
        .catch(err =>{
           console.log(err);
        });

});

// async function insertUser(req, res) {
//     const users = new Users();
//     users.email= req.body.email;
//     users.firstname= req.body.firstname;
//     users.lastname= req.body.lastname;
//     users.passwd= req.body.passwd;
//     users.save((err, doc) => {
//        if(!err)
//        {
//            res.redirect('phonebook/list');
//        }
//        else
//        {
//            console.log(err);
//        }
//     });
// }

router.post('/logout',(req, res)=>{
    req.session.destroy((err)=>{
            res.redirect('/login');
            console.log(err);
    });
});

router.get('/reset',(req,res)=>{
   res.render('Authentication/reset', {
       path: '/reset',
       pageTitle: 'Forgot Password?'
   })
});

router.post('/reset',(req,res,next)=>{
    const email =req.body.email;
   crypto.randomBytes(32,(err, buffer)=>{
       if(err)
       {
           console.log(err);
           return res.redirect('/reset');
       }
       const token = buffer.toString('hex');
       Users.findOne({email: req.body.email})
           .then(user=> {
               if(!user){
                   return res.redirect('/login/reset');
               }
               user.resetToken = token;
               user.resetTokenExpiration = Date.now() + 3600000;
               return user.save();
           })
           .then(result => {
               res.redirect('/login');
               console.log(req.body.email);
               return transporter.sendMail({

                   to: email,
                   from: 'panku799@gmail.com',
                   subject: 'Password Reset',
                   html: `<h1>Reset Password link</h1>
                           <p>click Link <a href="http://localhost:3000/login/reset/${token}">Link</a></p>
                    `
               })
                   .catch(err => {console.log(err)});
           })
           .catch(err => {console.log(err)});
   });
});

module.exports = router;
