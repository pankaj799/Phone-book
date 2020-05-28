const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Phonebook= mongoose.model('Phonebook');

router.get('/',(req,res)=>{
   res.render("phonedir/addOredit",{
      viewTitle: "Phone Book"
   });
});
router.post('/',(req,res)=>{
   if(req.body._id=='') {
      insertRecord(req, res);
   }
   else
   {
      updateRecord(req,res);
   }
});

function insertRecord(req,res){
   var phonebook = new Phonebook();
   phonebook.FullName = req.body.fullName;
   phonebook.DOB = req.body.DOB;
   phonebook.email = req.body.email;
   phonebook.mobile = req.body.tel;
   phonebook.save((err,doc)=>{
      if(!err)
      {
         res.redirect('phonebook/list');
      }else {
         console.log('Error during record insertion'+ err);
      }
   });
}

function updateRecord(req, res)
{
   Phonebook.findOneAndUpdate({_id: req.body._id }, {...req.body} , {new: true}, (err, doc) => {
      if(!err){
         res.redirect('phonebook/list');
      }
      else{
         if(err.name=='ValidationError')
         {
            handleValidationError(err, req.body);
            res.render("phonedir/addOredit",{
               viewTitle: 'Update Record',
               phonedata: req.body,

            });
         }
         else
         {
            console.log("Error"+ err);
         }
      }
   });
}

// function updateRecord(req, res){
//    const prodID = req.body._id;
//    const UpdateName = req.body.fullName;
//    const UpdateDOB = req.body.DOB;
//    const UpdateEmail = req.body.email;
//    const UpdateNum = req.body.tel;
//
//    Phonebook.findById(prodID)
//        .then(phoned =>{
//           phoned.FullName = UpdateName;
//           phoned.DOB = UpdateDOB;
//           phoned.email = UpdateEmail;
//           phoned.mobile = UpdateNum;
//           return phoned.save();
//        }).then(result => {
//           res.redirect('phonebook/list');
//    }).catch(err => console.log(err));
// }
router.get('/list',(req,res) => {
   Phonebook.find((err, docs)=>{
      if(!err)
      {

         res.render("phonedir/list",{
            list: {...docs}
         });
      }else
      {
         console.log('Error' + err);
      }
   });
});


router.get('/:id',(req,res)=>{
   Phonebook.findById(req.params.id, (err, doc)=>{
      if(!err)
      {
         res.render("phonedir/addOredit",{
            viewTitle: "Update PhoneBook",
            phonedata: doc
         });
      }
   });
});

router.get('/delete/:id', (req,res)=>{
   Phonebook.findOneAndDelete(req.param.id, (err, doc) => {
     if(!err)
     {
        res.redirect('/phonebook/list');
     }
     else
     {
        console.log('Error'+ err);
     }
  });

});
module.exports = router;
