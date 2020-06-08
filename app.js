const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const bodyparse = require('body-parser');
const _handlebars = require('handlebars');
const mongoose = require('mongoose');
const csrf = require('csurf');
const multer = require('multer');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
// const passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;
const expressSession = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const MONGODB_URI = "mongodb://localhost:27017/panku";

const store= new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions',
    });
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) =>{
       cb(null, 'images');
   },
   filename: (req, file, cb) =>{
       cb(null, file.filename+'-'+file.originalname);
   }
});

const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
  {
      cb(null, true);
  }
  else
  {
      cb(null, false);
  }
};

app.use(bodyparse.urlencoded({
    extended : true
}));
app.use(bodyparse.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
    expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store : store
}));
app.use(csrfProtection);

const data = require('./models/phonebook.model');

const usersController= require('./controller/usersController');
const phonebookController= require('./controller/phonebookController');

app.use((req, res, next)=>{
       res.locals.isAuthenticated = req.session.isLoggedin;
       res.locals.csrfToken = req.csrfToken();
   next();
});
app.use('/login',usersController);
// app.use('/',(req,res)=>{
//     res.redirect('/login');
// });
app.use('/phonebook', phonebookController);


app.set('views',path.join(__dirname, '/views/'));
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'mainLayout', lyoutDir: __dirname+'/views/layouts/',handlebars: allowInsecurePrototypeAccess(_handlebars)}));
app.set('view engine','hbs');



mongoose.connect(MONGODB_URI,
    {userNewUrlParser: true},
    () =>  console.log('Connected to DB!')
);

app.listen(3000);
