// Model Loading
const StateModel = require("../../schema/state_table");
const CityModel =  require("../../schema/city_table");
const AreaModel =  require("../../schema/area_table");

exports.addArea = function (req, res, next) {
    CityModel.find(function(err, db_city_array){
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_city_array);
            StateModel.find(function(err,db_state_array) {
                if(err){
                    console.log(err)
                }else{
                    //Render User Array in HTML Table
                    res.render('admin/area/add-area', { city_array : db_city_array, state_array : db_state_array });
                }
            }).lean();
          }
      }).lean();
};

exports.addAreaProcess = async function(req, res, next){
    console.log(req.body);
    //Create an Array 
    const mybodydata = {
      area_name: req.body.area_name,
      _city: req.body._city,
      _state: req.body._state
      }
      // console.log("Name is "  + req.body.area_name);
      // console.log("ID is "  + req.body._city);
      // console.log("ID is "  + req.body._state);
  var data = AreaModel(mybodydata);
  data.save(function(err) {
      if (err) {
         console.log("Error in Insert Record");
      } else {
          res.redirect('add');
      }
  })
}

exports.displayAreas = function (req, res, next) {
    AreaModel.find(function(err, db_area_array){
        console.log("area model : ",db_area_array);
        if (err) res.json({message: 'There are no posts here.'});

        AreaModel.find({}).lean()
          .populate('_city')
          .populate('_state')
          .exec(function(err, db_area_array) {
            console.log("After population : ",db_area_array[0]);
            res.render("admin/area/display-area", { mydata: db_area_array });
          })
      });
};

exports.deleteArea = function (req, res, next){
  AreaModel.findByIdAndDelete(req.params.id, function(err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
        res.redirect('/display');
    } else {
      console.log("Record Deleted ");
        res.redirect('/admin/area/display');
    }
});
}

exports.editArea =  function (req, res , next) {
  console.log(req.params.id);
  AreaModel.findById(req.params.id, function(err, db_area_array) {
      if (err) {
          console.log("Edit Fetch Error " + err);
      } else {
          console.log("demo : ",db_area_array);
          StateModel.find(function(err,db_state_array) {
                if(err){
                    console.log(err)
                }else{
                    //Render User Array in HTML Table
                    console.log("state_array is : ", db_state_array); 
                    CityModel.find(function(err,db_city_array) {
                      if(err){
                          console.log(err)
                      }else{
                          //Render User Array in HTML Table
                          console.log("db_city_array is : ", db_city_array); 
                          res.render('admin/area/edit-area', { mydata : db_area_array, state_array : db_state_array, city_array : db_city_array });
                      }
                  }).lean();
                    // res.render('area/edit-area', { mydata : db_area_array, state_array : db_state_array });
                }
            }).lean();
      }
  }).lean();
}

exports.editAreaProcess =  function (req, res, next) {
  console.log("Edit/Update ID is"+ req.params.id);

  const mybodydata = {
    area_name: req.body.area_name,
    _city: req.body._city,
    _state: req.body._state

  }

  AreaModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/area/display');
      } else {
        console.log("mybodydata is : ",mybodydata);
          res.redirect('/admin/area/display');
      }
  });
}

exports.address = function (req, res, next) {
  StateModel.find(function(err, db_state_array){  
      if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          console.log(db_state_array);
          res.render('admin/area/state-city-area', { state_array : db_state_array });
        }
    }).lean();
};

exports.cityPost = function(res, req, next){
   CityModel.find(function(err,db_city_array) {
              if(err){
                  console.log(err)
              }else{
                res.send(JSON.stringify({"flag":0,"message":"Success..","city_array":db_city_array}));
                // res.render('admin/area/state-city-area', { city_array : db_city_array }); 
             }
  });
}

exports.areaPost = function(res, req, next){
  AreaModel.find(function(err,db_area_array) {
             if(err){
                 console.log(err)
             }else{
               res.render('admin/area/state-city-area', { area_array : db_area_array });
            }
  });
}