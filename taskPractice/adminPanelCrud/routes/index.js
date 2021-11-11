var express = require("express");
var router = express.Router();
var path = require("path");
const multer = require("multer");
// const upload = multer({ dest: './public/uploads' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

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
  userFormModel.find(function(err,db_user_array) {
   if(err){
     console.log(err);
   }else{
     res.render("user/form", {user:db_user_array, layout:false});
   }
  })
});

router.post("/userForm",upload.single("image"), function (req, res, next) {

      console.log("files",req.file);
      const formData = {
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address,
        gender: req.body.gender,
        hobby: req.body.hobby,
        interestarea: req.body.interestarea,
        image: req.body.image,
      }
      console.log("formdata : ", formData);
      var data = userFormModel(formData);
    // res.send('ok')
      data.save(function (err) {
        if (err) {
          console.log("Error in Insert Record");
        } else {
          res.send(JSON.stringify({"flag":1,"message":"Success","formData":formData}));
        }
      });

});


module.exports = router;


 // var arr =  [5,2,3]
  // for(item of arr){
  //   console.log("arr item", item);
  // }