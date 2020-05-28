const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const bodyparse = require('body-parser');
const _handlebars = require('handlebars');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

app.use(bodyparse.urlencoded({
    extended : true
}));
app.use(bodyparse.json());

const data = require('./models/phonebook.model');

const phonebookController= require('./controller/phonebookController');


app.use('/phonebook', phonebookController);

app.use('/',(req,res)=>{
    res.redirect('/phonebook/list');
});
app.set('views',path.join(__dirname, '/views/'));
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'mainLayout', lyoutDir: __dirname+'/views/layouts/',handlebars: allowInsecurePrototypeAccess(_handlebars)}));
app.set('view engine','hbs');

require('./models/db');

app.listen(3000);
