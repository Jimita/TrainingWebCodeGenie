// Model Loading
const StateModel = require("../../schema/state_table");
const CityModel =  require("../../schema/city_table");

exports.addCity = function (req, res, next) {
    StateModel.find(function(err, db_state_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_state_array);
            //Render User Array in HTML Table
            res.render('admin/city/add-city', { mydata : db_state_array });
          }
      }).lean();
};

exports.addCityProcess = async function(req, res, next){
    console.log(req.body);
 
    //Create an Array 
    const mybodydata = {
      city_name: req.body.city_name,
      _state: req.body._state
      }
      console.log("Name is "  + req.body.city_name);
      console.log("ID is "  + req.body._state);
   
  var data = CityModel(mybodydata);
  data.save(function(err) {
      if (err) {
         console.log("Error in Insert Record");
      } else {
          res.redirect('add');
      }
  })
}

exports.displayCities = function (req, res, next) {
    CityModel.find(function(err, db_city_array){
        console.log("heyyy ",db_city_array);
        if (err) res.json({message: 'There are no posts here.'});

        CityModel.find({}).lean()
        .populate('_state')
          .exec(function(err, db_city_array) {
            console.log(db_city_array);
            res.render("admin/city/display-city", { mydata: db_city_array });
          })
      });
};

exports.deleteCity = function (req, res, next){
    CityModel.findByIdAndDelete(req.params.id, function(err, project) {
        if (err) {
          console.log("Error in Record Delete " + err);
            res.redirect('/display');
        } else {
          console.log("Record Deleted ");
            res.redirect('/admin/city/display');
        }
    });
}

exports.editCity =  function (req, res , next) {
    console.log(req.params.id);
    CityModel.findById(req.params.id, function(err, db_city_array) {
        if (err) {
            console.log("Edit Fetch Error " + err);
        } else {
            console.log(db_city_array);
            StateModel.find(function(err,db_state_array){
              if(err){
                console.log(db_state_array);
              }else{
                res.render('admin/city/edit-city', { mydata: db_city_array, state_array: db_state_array });
              }
            }).lean();
        }
    }).lean();
}

exports.editCityProcess =  function (req, res, next) {
    console.log("Edit ID is"+ req.params.id);
  const mybodydata = {
    city_name: req.body.city_name,
    _state: req.body._state
  }

  CityModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/admin/city/display');
      } else {
          res.redirect('/admin/city/display');
      }
  });
}