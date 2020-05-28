const mongoose = require('mongoose');

const phonebookSchema=new mongoose.Schema({
   FullName: {
       type: String
   },
    DOB: {
       type: Date,
        required: true
    },
    email: {
       type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
});

var created_date = new Date(phonebookSchema.DOB);

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var year = created_date.getFullYear();
var month = months[created_date.getMonth()];
var date = created_date.getDate();

mongoose.model('Phonebook', phonebookSchema);
