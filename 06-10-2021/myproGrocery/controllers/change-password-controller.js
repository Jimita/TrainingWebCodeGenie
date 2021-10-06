var UsersModel = require('../models/usertable');

exports.getChangePassword = function (req, res, next) {
    if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/login');
    }
    
    res.render('change_password');
};

exports.getChangePasswordProcess = function (req, res, next) {
    if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/login');
    }
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;

    UsersModel.findOne({ "user_email": myemail }, function(err, db_users_array) {
        if (err) {
            console.log("Error in Old Password Fetch " + err);
        } else {
            console.log(db_users_array);


            if (opass == db_users_array.user_password) {

                if (opass == npass) {
                    res.end("New Password Must be Different then Old password");
                } else {

                    if (npass == cpass) {

                        UsersModel.findOneAndUpdate({ "user_email": myemail }, { $set: { "user_password": npass } }, function(err) {

                            if (err) {
                                res.end("Error in Update" + err);
                            } else {

                                res.send("Password Changed");
                            }

                        });
                    } else {
                        res.end("New Password and Confirm Password not match");
                    }
                }

            } else {
                res.end("Old Password Not Match");
            }
        }
    });
};
