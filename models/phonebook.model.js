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



mongoose.model('Phonebook', phonebookSchema);
