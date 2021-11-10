var { check, validationResult } = require('express-validator');
const Bcrypt = require("bcryptjs");
// Model Loading
const LoginModel = require("../../schema/login_table.");


exports.getlogin = function (req, res, next) {
    res.render('admin/form/login');
};

exports.loginProcess =    async function(req, res, next){
    console.log("data body is  : ",req.body);

  //Create an Array 
  const mybodydata = {
    email: req.body.email,
    password: Bcrypt.hashSync(req.body.password)
  }
  console.log("body", mybodydata);
    try {
        var data = LoginModel(mybodydata);
        const logindata = await data.save()  
        console.log(logindata);
        // res.render('admin/form/login');
    } catch (error) {
        next(error);
    }
}

