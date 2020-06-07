const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/usersSchema');
const bcrypt = require('bcryptjs');
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
            return transporter.sendMail({
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

module.exports = router;
