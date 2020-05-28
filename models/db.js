const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/panku",
    {userNewUrlParser: true},
    () =>  console.log('Connected to DB!')
);

require('./phonebook.model');
