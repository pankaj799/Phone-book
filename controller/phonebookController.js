const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Phonebook = mongoose.model('Phonebook');
const Items_per_page = 4;

router.get('/', (req, res) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    res.render("phonedir/addOredit", {
        viewTitle: "Phone Book",
    });
});
router.post('/', (req, res) => {
    if (req.body._id == '') {

            insertRecord(req, res);


    } else {
        updateRecord(req, res);
    }
});

async function insertRecord(req, res) {

        const image = req.file;
        if(!image)
        {
            return res.render('phonedir/addOredit');
        }
        else
        {
            const imagepath = image.path;
            var phonebook = new Phonebook();
            phonebook.FullName = req.body.fullName;
            phonebook.DOB = req.body.DOB;
            phonebook.image = imagepath;
            phonebook.email = req.body.email;
            phonebook.mobile= req.body.tel;
            phonebook.save((err, doc) => {
                console.log(doc);
                if (!err) {
                    res.redirect('phonebook/list');
                } else {
                    console.log('Error during record insertion' + err);
                }
            });
        }

}

function updateRecord(req, res) {


    const prodID = req.body._id;
    const UpdateName = req.body.fullName;
    const UpdateDOB = req.body.DOB;
    const Updateimage = req.file;
    const UpdateEmail = req.body.email;
    const UpdateNum = req.body.tel;

    Phonebook.findById(prodID)
        .then(phoned => {
            phoned.FullName = UpdateName;
            phoned.DOB = UpdateDOB;
            if(Updateimage)
            {
                phoned.image = Updateimage.path;
            }

            phoned.email = UpdateEmail;
            phoned.mobile = UpdateNum;
            return phoned.save();
        }).then(result => {
        res.redirect('phonebook/list');
    }).catch(err => console.log(err));
}

router.get('/list', (req, res) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const page = req.query.page;
    Phonebook.find()
        .skip((page - 1) * Items_per_page)
        .limit(Items_per_page)
        .then(docs => {
            res.render("phonedir/list", {
                viewTitle: "Record",
                list: {...docs}
            });
        });

});


router.get('/:id', (req, res) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    Phonebook.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("phonedir/addOredit", {
                viewTitle: "Update PhoneBook",
                phonedata: doc,
                csrfToken: req.csrfToken()
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {

    Phonebook.findOneAndDelete(req.param.id, (err, doc) => {
        if (!err) {
            res.redirect('/phonebook/list');
        } else {
            console.log('Error' + err);
        }
    });

});



router.post('/search', (req, res) => {

    var name = req.body.name;
    var email = req.body.email;
    var num = req.body.number;
    Phonebook.findOne({FullName: {$regex: name}, email: {$regex: email}, mobile: {$regex: num}}, function (err, doc) {
        console.log(doc);
    }).then(docs => {
        res.render("phonedir/searchoutput", {
            viewTitle: "Search Result",
            list: docs
        });

    });
});


module.exports = router;
