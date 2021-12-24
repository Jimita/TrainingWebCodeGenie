var cron = require("node-cron");
var filesModel = require("../models/files_model");
var userAuthModel = require("../models/userAuth_model");

const csvtojson = require("csvtojson");

let finalArr = [];
let csvDuplicates = {};
let total;
let duplicates = 0;
let discarded = 0;
let totalUploaded = 0;
let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var jsonObj;
let duplicateUser;

if (config.scheduler) {
  cron.schedule(config.files.fileProcess.time, async () => {
    var pendingFileData = await filesModel.find({
      status: "inprogress",
    });
    console.log(
      "---------------------pending data------------------- ",
      pendingFileData.length
    );
    for (let file of pendingFileData) {
      console.log("file in loop ", file._id);
      let keysOfObject = Object.keys(file.fieldMappingObject);
      let valueOfObject = Object.values(file.fieldMappingObject);
      console.log("keysOfObject ", keysOfObject);
      //["name", "email", "moblie"]
      // for(let keyVal of keysOfObject){
      //   console.log("validateKey",keyVal)
      // }

      jsonObj = await csvtojson({
        noheader: true,
      }).fromFile("./public/imports/" + file.name);
      // duplication csv data with userModel data


      for (item = 0; item < jsonObj.length; item++) {
        for (keyItem = 0; keyItem < valueOfObject.length; keyItem++) {
          let userObj = jsonObj[item];
          /*{
          name:"jimita",
        }*/
          let mapVal = valueOfObject[keyItem]; // "field1"
          let keys = keysOfObject[keyItem]; // "name"
          // name
          file.fieldMappingObject[keys] = userObj[mapVal]; //jimita
        }
        console.log("file.fieldMappingObject ", file.fieldMappingObject.email)
        // discarded data
        if (emailRegExp.test(file.fieldMappingObject.email) == false || file.fieldMappingObject.mobile.length < 10 || file.fieldMappingObject.mobile.length > 10) {
          console.log("discarded");
          discarded++;
        }
        // check csv objs duplication
        else if (csvDuplicates[file.fieldMappingObject.email] || csvDuplicates[file.fieldMappingObject.mobile]) {
          console.log("duplicates");
          duplicates++;
        } else if (file.fieldMappingObject.email || file.fieldMappingObject.mobile) {
          console.log("ashxdnaskjxdn")
          let mobile = file.fieldMappingObject.email;
          let email = file.fieldMappingObject.mobile;
          csvDuplicates[mobile] = 1;
          csvDuplicates[email] = 1;
        } else if (duplicateUser = await userAuthModel.findOne({
            $or: [{
              email: file.fieldMappingObject.email,
            }, {
              mobile: file.fieldMappingObject.mobile,
            }],
          })) {
          duplicates++;
        } else {
          let lastObj = {
            name: file.fieldMappingObject.name,
            email: file.fieldMappingObject.email,
            mobile: file.fieldMappingObject.mobile,
            password: "no need password",
          };
          finalArr.push(lastObj);
          totalUploaded++;
        }
      }
      console.log("duplicates", duplicates);
      console.log("discarded", discarded);
      console.log("totalUploaded", totalUploaded);
      // var fileData = await filesModel.updateOne({
      //   _id: file._id,
      // }, {
      //   discarded: discarded,
      // });
      // insertMany to userAuth Model
      var csvData = await userAuthModel.insertMany(finalArr);
      // updateOne to files Model
      var fileData = await filesModel.updateOne({
        _id: file._id,
      }, {
        duplicates: duplicates,
        discarded: discarded,
        status: "success",
      });
      console.log(
        "-------------------------------------------------------------------------------------------"
      );
    }
  });

  // cron.schedule(config.files.mailCron.time, async () => {
  //     console.log("Another cron working")
  //   });
} else {
  console.log("cron is off...");
}

// cron.start();