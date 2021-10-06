var UsersModel = require('../models/usertable');
exports.getUserDetails = function (req, res, next) {
    console.log("my id json : ",req.params.myid);
    // console.log("my id object : ", JSON.parse(myid))

    UsersModel.findById(req.params.myid, function(err, db_users_array) {
        if (err) {
            console.log("display Fetch Error " + err);
        } else {
            console.log(db_users_array);

            res.render('user_details', { user_array: db_users_array });
        }
    }).lean();
};