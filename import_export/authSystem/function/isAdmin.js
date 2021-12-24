var userAuthModel = require("../models/userAuth_model");

/*
fuction to check user(admin) is stored or not.
if stored then log(user is available)
else insert admin in userAuth model
*/

(async function isAdmin(value) {
    try {
    var user = await userAuthModel.findOne({email:"admin@admin.com"});
    console.log("user...",user)
    // check if user is present in model or not
    if (user) {
        console.log("user is already exist")
    } else {
      // created an array
      const mydata = {
        name: "Admin",
        email: "admin@admin.com",
        mobile: "1234567890",
        password: "123456"
      }
      // store data in db
      var user = userAuthModel(mydata)
      user.save();   
      console.log("user is inserted")
    }
    } catch (error) {
      console.log(error)
    }
  })();