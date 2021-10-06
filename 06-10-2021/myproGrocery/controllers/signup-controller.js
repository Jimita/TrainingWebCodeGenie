var UsersModel = require('../models/usertable');

exports.getSignup = function (req, res, next) {
    console.log("Signup Page")
    res.render('signup');
};


exports.getSignupProcess = function (req, res, next) {
    console.log("Signup Process")
    console.log(req.body);

    //Create an Array 
    const mybodydata = {
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_dob: req.body.user_dob,
        user_mobile: req.body.user_mobile,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        user_isadmin: req.body.user_isadmin

    }
    var data = UsersModel(mybodydata);

    data.save(function(err) {
        if (err) {
            console.log("Error in Insert Record" + err);
        } else {
            console.log(mybodydata);
            res.render('signup');
        }
    })
};