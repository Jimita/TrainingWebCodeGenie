var { check, validationResult } = require('express-validator')

// Model Loading
var FormModel = require('../../models/form_model');


exports.addForm = function (req, res, next) {
        res.render('admin/form/add');  
};

// exports.addFormProces = [
//     check('name', 'Name should be more than 4 charachters').isLength({ min: 4 }),
//     check('email', 'Email should be more than 10 charachters').isLength({ min: 10 })
//   ],
//     function (req, res, next) {
//         console.log("in");
//       console.log("my data is  : ",req.body)
//       var errors = validationResult(req).array();
//       if (errors) {
//         req.session.errors = errors;
//         req.session.success = false;
//         res.redirect('/admin/form/dashboard')
//       }
//       else {
//         req.session.success = true;
//         res.redirect('/admin/form/dashboard')
//       }
// }

// exports.dashboard = function(req,res,next){
//     myerrors =  req.session.errors;
//     mysuccess = req.session.success;
//     res.render('admin/form/dashboard', {myerrors:myerrors , mysuccess:mysuccess});
// }

