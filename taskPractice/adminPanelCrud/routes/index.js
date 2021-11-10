var express = require("express");
var router = express.Router();

var userFormModel = require('../models/userForm_table');


/* GET index page. */
router.get("/", function (req, res, next) {
  console.log("Dashboard Called " + req.session.email);
  var myemail = req.session.email;
  var myid = req.session._id;
  console.log(myemail);
  console.log("your id is : ", myid);

  //Auth
  if (!req.session.email) {
    console.log("Email Session is Set");
    res.end("Login required to Access this page");
  }
  res.render("index", { myemail: myemail, myid: myid });
});

// user form validation task (ajax jquery crud)

router.get("/userForm", function (req, res, next) {
  // var arr =  [5,2,3]
  // for(item of arr){
  //   console.log("arr item", item);
  // }
  res.render("user/form", { layout: false });
});

router.post("/userFormProcess", function (req, res, next) {
  console.log(req.body);

  // var fileobject = req.files.image;
  // var filename = req.files.image.name;
  // console.log("filename",filename);
  
  const formData = {
    fname: req.body.fname,
    lname: req.body.lname,
    address: req.body.address,
    gender: req.body.gender,
    hobby: req.body.hobby,
    interestarea: req.body.interestarea,
    // image: filename,
  }
  // console.log("formdata : ", formData);
  var data = userFormModel(formData);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.render('user/form');

      // fileobject.mv("public/userFormUploads/" + filename, function (err) {
      //   if (err) throw err;
      //   res.send("Data Stored Successfully..");
      //   // res.redirect("userForm");
      // });
    }
  });
});

module.exports = router;
