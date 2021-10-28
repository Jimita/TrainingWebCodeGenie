// Model Loading
var UserModel = require("../../models/user_model");
const AreaModel = require("../../schema/area_table");

exports.addUser = function (req, res, next) {
  AreaModel.find(function (err, db_area_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log(db_area_array);
      //Render User Array in HTML Table
      res.render("users/add", { area_array: db_area_array });
    }
  }).lean();
};

exports.addUserProcess = function (req, res, next) {
  console.log("add process started...");
  console.log("my body data is : ", req.body);
  var fileobject = req.files.user_photo;
  var filename = req.files.user_photo.name;
  const mybodydata = {
    user_name: req.body.name,
    user_email: req.body.email,
    user_age: req.body.age,
    user_gender: req.body.gender,
    user_birthdate: req.body.birthdate,
    user_mobile: req.body.mobile,
    user_photo: filename,
    user_address: req.body.address,
    user_password: req.body.password,
    _area: req.body._area,
  };
  var data = UserModel(mybodydata);

  data.save(function (err) {
    data.save(function (err) {
      if (err) {
        console.log("Error in Add Record" + err);
      } else {
        fileobject.mv("public/userImages/" + filename, function (err) {
          if (err) throw err;
          // res.send("File Uploaded");
          console.log("Record Added");
          res.render("users/add", { msg: "Record stored successfully" });
        });
      }
    });
  });
};

exports.displayUsers = function (req, res, next) {
  UserModel.find(function (err, data) {
    console.log(data);
    if (err) res.json({ message: "There are no posts here." });

    UserModel.find({})
      .lean()
      .populate("_area")
      .exec(function (err, data) {
        console.log(data);
        res.render("users/display", { mydata: data });
      });
  });
};

exports.deleteUser = function (req, res, next) {
  var deleteid = req.params.id;
  UserModel.findByIdAndDelete(deleteid, function (err, data) {
    if (err) {
      console.log("Error in Delete" + err);
    } else {
      console.log("Record Deleted" + deleteid);
      res.redirect("/admin/users/display");
    }
  });
  res.render("admin/users/add");
};

exports.editUser = function (req, res, next) {
  console.log(req.params.id);
  UserModel.findById(req.params.id, function (err, data) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(data);
      AreaModel.find(function (err, db_area_array) {
        if (err) {
          console.log(err);
        } else {
          console.log("db_area_array", db_area_array);
          res.render("users/edit", { mydata: data, area_array: db_area_array });
        }
      }).lean();
    }
  }).lean();
};

exports.editUserProcess = function (req, res, next) {
  var editid = req.params.id;
  const mybodydata = {
    user_name: req.body.name,
    user_email: req.body.email,
    user_age: req.body.age,
    user_gender: req.body.gender,
    user_birthdate: req.body.birthdate,
    user_address: req.body.address,
    user_password: req.body.password,
    user_mobile: req.body.mobile,
    _area: req.body._area,
  };
  UserModel.findByIdAndUpdate(editid, mybodydata, function (err, data) {
    if (err) {
      console.log("Error in Edit" + err);
    } else {
      console.log(data);
      res.redirect("/admin/users/display");
    }
  }).lean();
};

exports.searchuser = async function (req, res, next) {
  try {
    let userData = await UserModel.find({});

    if (userData) {
      console.log(userData);
      res.render("users/displaySearch", { mydata: userData });
    }
  } catch (error) {
    console.log("Error in Fetch Data " + error);
  }
};

exports.searchuserProcess = async function (req, res, next) {
  try {
    UserModel.find(
      {
        $and: [
          { user_name: { $regex: req.query.searchname } },
          { user_email: { $regex: req.query.searchemail } },
        //   { user_mobile: { $regex: req.query.searchmobile }}
        ],
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
            if(data == ''){
            res.render("users/displaySearch", { msg: "Data not found" });
            return;
            }
            console.log("my data is : ",data)
            res.render("users/displaySearch", { mydata: data });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
