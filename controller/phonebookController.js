const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Phonebook= mongoose.model('Phonebook');

const Items_per_page=4;

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

// function updateRecord(req, res)
// {
//    Phonebook.findOneAndUpdate({_id: req.body._id }, {...req.body} , {new: true}, (err, doc) => {
//       if(!err){
//          res.redirect('phonebook/list');
//       }
//       else{
//          if(err.name=='ValidationError')
//          {
//             handleValidationError(err, req.body);
//             res.render("phonedir/addOredit",{
//                viewTitle: 'Update Record',
//                phonedata: req.body,
//
//             });
//          }
//          else
//          {
//             console.log("Error"+ err);
//          }
//       }
//    });
// }

function updateRecord(req, res){
   const prodID = req.body._id;
   const UpdateName = req.body.fullName;
   const UpdateDOB = req.body.DOB;
   const UpdateEmail = req.body.email;
   const UpdateNum = req.body.tel;

   Phonebook.findById(prodID)
       .then(phoned =>{
          phoned.FullName = UpdateName;
          phoned.DOB = UpdateDOB;
          phoned.email = UpdateEmail;
          phoned.mobile = UpdateNum;
          return phoned.save();
       }).then(result => {
          res.redirect('phonebook/list');
   }).catch(err => console.log(err));
}

router.get('/list',(req,res) => {
   const page= req.query.page;
   Phonebook.find()
       .skip((page-1)*Items_per_page)
       .limit(Items_per_page)
       .then(docs => {
          res.render("phonedir/list",{
             viewTitle: "Record",
             list: {...docs}
          });
       });
   // Phonebook.find((err, docs)=>{
   //    if(!err)
   //    {
   //
   //       res.render("phonedir/list",{
   //          list: {...docs}
   //       });
   //    }else
   //    {
   //       console.log('Error' + err);
   //    }
   // });
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

// router.get('/autocomplete',(req,res)=>{
//    var regex = new RegExp(escapeRegex(req.query.Search), 'gi');
//    // var phonefilter = Phonebook.find({FullName: regex} , {'FullName':1}).sort({"updated_at": -1}).sort({"created_at": -1}).limit(20);
//    // phonefilter.exec(function (err,data) {
//    //    console.log(data);
//    //    var result= [];
//    //    if(!err)
//    //    {
//    //       if(data && data.length && data.length>0){
//    //       data.forEach(user=>{
//    //          let obj={
//    //             id: user._id,
//    //             label: user.name
//    //          };
//    //          result.push(obj);
//    //       });
//    //    }
//    //    res.jsonp(result);
//    //    }
//       Phonebook.find({'name':regex}, function (err, data) {
//          if(err)
//          {
//             console.log(err);
//          }
//          else {
//             res.render("/phonebook/searchoutput", {res : data});
//          }
//       })
//
//
// });


router.post('/search', (req, res) => {

   var name = req.body.name;
   var email = req.body.email;
   var num = req.body.number;
   Phonebook.findOne({FullName: {$regex:name},email:{$regex: email}, mobile: {$regex: num}},function (err,doc) {
      console.log(doc);
   }).then(docs => {
             res.render("phonedir/searchoutput",{
                viewTitle: "Search Result",
                list: docs
             });

   });
});



module.exports = router;
