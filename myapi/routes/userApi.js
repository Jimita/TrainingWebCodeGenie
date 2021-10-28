var express = require('express');
var router = express.Router();
var UserDetail = require('../model/UserDetailModel');
const fetch = require("node-fetch");
const { response } = require('express');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/displayUserDetailApi", async function(req, res, next){
    UserDetail.find({},function(err,mydata){
        console.log("my data is : ", mydata)
        if(err){
          res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
        }else{
          res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
        }
      });
});

router.get("/display", async function(req, res, next){
   let data = await fetch("http://127.0.0.1:3000/userDetail/displayUserDetailApi")
   let users =  await data.json();
//    console.log("myusers are : ",users);
   res.render("displayUserDetail",{mydata:users});
});

router.post('/add-userDetail-api', function(req,res,next){
    const mybodydata = {
      name : req.body.name,
      address : req.body.address,
      mobile : req.body.mobile
    }
    console.log("my body data is : ", mybodydata);
    var data = UserDetail(mybodydata);
    data.save(function(err){
      if(err){
        res.send(JSON.stringify({"flag":0,"message":"Server Error in api ","err":err}));
      }else{
        res.send(JSON.stringify({"flag":1,"message":"record added...","mydata":data}));
      }
    })
  
});

router.get('/weather',async function(req, res, next){
    let weatherData = await fetch("https://api.openweathermap.org/data/2.5/weather?q=ahmedabad&units=metric&APPID=7245b6e542efb72f46a0c7ccb962db35")
    let data = await weatherData.json();
  //  console.log("my weather data is : ",data);
    res.render("weatherDisplay",{mydata:data})
});

module.exports = router;
