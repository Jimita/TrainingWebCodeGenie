var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var {check,validationResult} = require("express-validator");
const {Parser} = require("json2csv");
const fs = require("fs");
const multer = require("multer");
const csvtojson = require("csvtojson");
const {v4: uuidv4} = require("uuid");
// const csvFilePath = '<./public/imports>'

/*
store files using multer with given destination
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/imports");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});
const upload = multer({
  storage: storage
});

// require database models(schema)
var userAuthModel = require("../models/userAuth_model");
var filesModel = require("../models/files_model");
var fieldModel = require("../models/field_model");

// JWT

function authJWT(req, res, next) {
  console.log("req cookie data", req.cookies.token);
  console.log(typeof req.cookies);
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // const privateKey = "jimitagandhiyouaredoingyourbestandyouarebest";
  jwt.verify(token, config.JWT.secret, function (err, user) {
    if (err) {
      res.redirect("/loginUser");
    } else {
      // declare logged user globally
      req.users = user;
      console.log("logged-user", req.users);
      next();
    }
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {title: "Express"});
});

/*
UI route for post method to store user details to db
*/
router.post("/addUser", async function (req, res, next) {
  try {
    const formData = req.body;
    var data = await userAuthModel(formData);
    var userData = await userAuthModel.findOne({
      email: formData.email,
      mobile: formData.mobile,
    });
    if (userData) {
      res.send({
        type: "error",
        messaage: "Already Exist in Database",
      });
    } else {
      // store data in model
      data.save(async function (err, data) {
        if (err) {
          console.log("Error in Insert Record");
        } else {
          res.json({
            flag: 1,
            message: "Success",
            isUpdate: false,
            formData: data,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

/*
UI route for adding new user
*/
router.get("/loginUser", function (req, res, next) {
  res.render("loginUser", {
    title: "loginUser"
  });
});

// ------------------------------------ API ------------------------------------------------
/*
 API for signup user to store new user in db
 */
router.post(
  "/api/signup",
  [
    check("email", "Email length should be 10 to 30 characters")
    .isEmail()
    .isLength({
      min: 10,
      max: 30
    }),
    check("name", "Name length should be 10 to 20 characters").isLength({
      min: 2,
      max: 20,
    }),
    check("mobile", "Mobile number should contains 10 digits").isLength({
      min: 10,
      max: 10,
    }),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      const mybodydata = req.body;
      var userData = await userAuthModel.findOne({
        email: mybodydata.email,
        mobile: mybodydata.mobile,
      });
      if (userData) {
        res.send({
          type: "error",
          messaage: "Already Exist in Database",
        });
      } else {
        var user = await userAuthModel(mybodydata);
        user.save();
        res.send("Successfully validated and stored");
      }
    }
  }
);

/*
Login API to check user in db,
Created token using private key using jwt
*/
router.post("/api/login", async (req, res) => {
  try {
    console.log(req.body.name);
    let data = await userAuthModel.findOne({
      $or: [{
          email: req.body.name
        },
        {
          mobile: req.body.name
        },
        {
          name: req.body.name
        },
      ],
    });
    console.log("dataaaa...", data);
    if (data) {
      // if match generate token for user login
      if (req.body.password == data.password) {
        //Token Key 32 Character
        var privateKey = "jimitagandhiyouaredoingyourbestandyouarebest";
        let params = {
          userId: data._id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
        };
        console.log("params", params);
        var token = jwt.sign(params, privateKey); // , { expires_in: '500s' }
        res.cookie("token", token);
        console.log("Token is " + token);
        console.log("req.headers", req.headers.cookie);
        // res.sendStatus(200);
        res.send({
          type: "success",
          login: true,
          messaage: "login successfully",
          token: token,
          header: req.headers.cookie,
          status: 200,
        });
      } else {
        res.send("password wrong please enter correct password...");
      }
    } else {
      res.send("user not found...");
    }
  } catch (error) {
    console.log(error);
  }
});

/*
userList api
*/
router.get("/api/userList", authJWT, async function (req, res, next) {
  try {
    /*
  Use user list API to export user data in CSV.
 */
    if (req.query.exportId) {
      // export file code
      const filePath = "exports-" + ".csv";
      const fields = ["name", "email", "mobile", "password"];
      const opts = {
        fields
      };
      const parser = new Parser(opts);
      console.log("export data", req.body);
      var exportData = await userAuthModel.find();
      console.log(exportData);
      // convert file to csv using parse
      const csv = parser.parse(exportData);
      console.log("csv", csv);
      // store file upload to the path(public/ecports)
      fs.writeFile("public/exports/" + filePath, csv, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("stored successfully");
          console.log(filePath);
        }
      });
      res.send({
        type: "success",
        data: exportData,
        file: filePath
      });
    } else {
      var user = await userAuthModel.find();
      console.log("users", user);



      res.render("userList", {
        user: user
      });
      // res.send({ type: "success", messaage: "userList Page"})
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * import route to import csv file and perform different operation on json obj
 */
router.post(
  "/import",
  authJWT,
  upload.single("importCsv"),
  async function (req, res, next) {
    try {
      // check file from req.file using multer
      let file = req.file;
      console.log("req.file", req.file);
      if (req.file) {
        let dataArray;
        let firstRow;
        let secondRow;
        /*
        import csv to json
        */
        var jsonObj = await csvtojson({
          noheader: true
        }).fromFile(
          req.file.path
        );
        /**
         * fetch keys from jsonObj for storing value(csvField),
         * fetch first and second values for displaying firstRow and secondRow
         */
        var csvField = Object.keys(jsonObj[0]);
        firstRow = Object.values(jsonObj[0]);
        secondRow = Object.values(jsonObj[1]);

        // fetch aa field from fieldsModel
        let dbfields = ["name", "email", "mobile"];

        //in this we find all the new fields added in fieldModel
        let allField = await fieldModel.findOne();

        //we concat our field array and (name,email,mobile) array
        let alldbFields = dbfields.concat(allField.field);

        /**
         * store initial fileName and userUploaded ID to fileModel
         */
        var storeData = {
          name: req.file.filename,
          filePath: req.file.path,
          uploadedBy: req.users.userId,
        };
        // store data in fileModel
        var data = await filesModel(storeData);
        data.save(function (err, data) {
          if (err) {
            console.log("Error in Insert Record");
          } else {
            // send res to ajax success function
            res.send({
              type: "success",
              message: "stored succesfully",
              data: {
                storedData: data,
                jsonObj: jsonObj,
                filename: data._id,
                firstRow: firstRow,
                secondRow: secondRow,
                csvField: csvField,
                alldbFields: alldbFields,
              },
            });
          }
        });
      } else {
        res.send({
          type: "error",
          message: "Error Message"
        });
      }
    } catch (error) {
      res.send({
        type: "error",
        message: "Error Message",
        error: error
      });
    }
  }
);

/**
 * mapping data from ajax and perform below operation with json obj
 * * Name,Field Mapping object,File Path,skipFirstRow, Records,,Discarded,Total Uploaded,Uploaded By (user id),Status (pending/in progress/uploaded),CreatedAt/UpdatedAt
 */
router.put("/mapping/:file_id/:headerOrNot", async function (req, res, next) {
  try {
    // console.log("params from req", req.params);
    // check file_id present in params
    if (req.params) {
      var jsonObj;

      // fetch file details using file_id to get path from fileName
      let file = await filesModel.findOne({
        _id: req.params.file_id
      });
      // fetch filePath and convert csv to json
      jsonObj = await csvtojson({
        noheader: true
      }).fromFile(
        "./public/imports/" + file.name
      );
      console.log("json obj ", jsonObj);
      if (req.params.headerOrNot == "headerValue") {
        console.log("obj to store in db is ", jsonObj)
        jsonObj = jsonObj.slice(1);
        var skipValue = await filesModel.updateOne({
          _id: req.params.file_id
        }, {
          skipFirstRow: "true",
          fieldMappingObject: req.body,
          totalRecords: jsonObj.length,
          status: "inprogress"
        });
      } else {
        var skipValue = await filesModel.updateOne({
          _id: req.params.file_id
        }, {
          fieldMappingObject: req.body,
          totalRecords: jsonObj.length,
          status: "inprogress"
        });
      }
      // fileModel data display
      var fileModelData = await filesModel.find();
      console.log("fileModelData", fileModelData);

      res.send({
        type: "success",
        message: "Stored csv in user model successfully",
        csvData: csvData,
        fileData: fileData,
        fileModelData: fileModelData,
      });
    } else {
      res.send({
        type: "error",
        code: 404,
        message: "Error Message"
      });
    }
  } catch (error) {
    res.send({
      type: "error",
      message: "Error",
      error: error
    });
  }
});

/**
 * display all files from file model
 */
router.get("/displayFile", async function (req, res, next) {
  try {
    var fileData = await filesModel.find()
    res.send({
      type: "success",
      message: "Successfully got file data",
      fileData: fileData
    });
  } catch (error) {
    res.send({
      type: "error",
      message: "Error Message for file display",
      error: error,
    });
  }
});

/**
 * add new field to field model 
 */
router.post("/fieldAdd", async function (req, res, next) {
  try {
    var fieldAdd = req.body.field;
    var dbAdd = await fieldModel.updateOne({}, {
      $addToSet: {
        field: fieldAdd
      }
    }, {
      upsert: true
    });
    res.send({
      type: "success",
      message: "success Message, new field added...",
      field: dbAdd,
    });
  } catch (error) {
    res.send({
      type: "error",
      message: "Error Message while adding field",
      error: error,
    });
  }
});

/**
 * logout(remove cookie)
 */
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      status: "success",
      code: 200
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

module.exports = router;