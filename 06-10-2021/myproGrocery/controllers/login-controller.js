var UsersModel = require('../models/usertable');

exports.getLogin = function (req, res, next) {
    console.log("Login Page")
    res.render('login');
};

exports.getLoginProcess = function (req, res, next) {
    console.log("Login process")
    var email = req.body.user_email;
    var password = req.body.user_password;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function(err, db_users_array) {

        console.log("Find One " + db_users_array);

        if (db_users_array) {
            var db_id = db_users_array._id;
            var db_email = db_users_array.user_email;
            var db_password = db_users_array.user_password;

        }
        console.log("db_users_array.user_id " + db_id);
        console.log("db_users_array.user_email " + db_email);
        console.log("db_users_array.user_password " + db_password);

        if (db_email == null) {
            console.log("If");
            res.end("Email not Found");
        } else if (db_email == email && db_password == password) {
            console.log("i m inside....")
            req.session.email = db_email;
            req.session._id = db_id;
            res.redirect('/home');
        } else {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }
    });
};
  