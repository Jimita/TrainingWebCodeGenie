var express = require('express');
const { addForm } = require('../controllers/adminControllers/form-controller');
var router = express.Router();
var { check, validationResult } = require('express-validator');
const FormModel =  require("../models/form_model");
const { getlogin, loginProcess } = require('../controllers/adminControllers/login-controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// -------------------  User Routes/Controller 
router.get('/add', addForm);

router.post('/add', [
    check('name', 'Name should be more than 4 charachters').isLength({ min: 4 }),
    check('email', 'Email should be more than 10 charachters').isLength({ min: 10 }),
    check('mobile', 'Mobile number should be 10 Digit and Only Indian Number is required').matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/),
    check('password', 'Password must have : Min 1 uppercase letter, Min 1 lowercase letter, Min 1 special character, Min 1 number, Min 8 characters, Max 10 characters.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,10}$/),
    check('pancard', 'Pancard Number Required').matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/).withMessage('Pancard must have first 5 uppercase letters, next 4 numbers, and last 1 uppercase letter.'),
    check('aadharcard', 'Aadharcard Number Required').matches(/[2-9]{1}[0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4}$/).withMessage('The first digit is between 2 and 9, Max 12 digits.'),
    check('passportcard', 'Passport Number Required').matches(/^(?!0{3,20})[A-Z0-9]{3,8}$/).withMessage('The first value should be Uppercase and next 7 should be digit, Max 8 Characters.'),
    check('gstnumber', 'GST Number Required').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}?$/).withMessage('GST Number not valid.. 22AAAAA0000A1Z5'),
  ], 
    function (req, res, next) {
      console.log(req.body)
      var errors = validationResult(req).array();
      if (errors.length) {
        // let er = {};
        // for (let err of errors) {
        //   if (er[err.param]) {
        //     er[err.param].push(err.msg);
        //   } else {
        //     er[err.param] = [];
        //     er[err.param].push(err.msg);
        //   }
        // }
        console.log("my error is : ",errors); 
        res.send(JSON.stringify({"flag":0,"message":"Error in api ","myerrors":errors}));
       // res.render('admin/form/add', {myerrors: er});
      }
      else {
        req.session.success = true;
        const mybodydata = {
          name: req.body.name,
          email: req.body.email,
          mobile : req.body.mobile,
          password: req.body.password,
          pancard: req.body.pancard,
          aadharcard : req.body.aadharcard,
          passportcard : req.body.passportcard,
          gstnumber : req.body.gstnumber
          } 
          console.log("my body data is : ", mybodydata);
      var data = FormModel(mybodydata);
      data.save(function(err) {
          if (err) {
             console.log("Error in Insert Record");
          } else {
            res.render('admin/form/add', {msg:"Record added Successfully..."});
          }
      })
      }
});

router.get('/display', function(req, res, next){
  FormModel.find(function(err, db_form_array) {
    if (err) {
        console.log("Error in Fetch Data " + err);
      } else {
        //Print Data in Console
        console.log(db_form_array);
        //Render User Array in HTML Table
        res.render('admin/form/display', { mydata: db_form_array });
      }
  }).lean();
});

// login for hash pwd
router.get('/addform', getlogin);
router.post('/addform',  loginProcess);

module.exports = router;