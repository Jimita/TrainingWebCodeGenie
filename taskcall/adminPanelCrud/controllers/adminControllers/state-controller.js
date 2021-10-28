// Model Loading
const StateModel = require("../../schema/state_table");

exports.addState = function (req, res, next) {
    res.render('admin/state/add-state');
};

exports.addStateProcess = async function(req, res, next){
    console.log(req.body);
    //Create an Array 
    const mybodydata = {
      state_name: req.body.state_name
  }
  var data = StateModel(mybodydata);
   
  data.save(function(err) {
      if (err) {
         console.log("Error in Insert Record");
      } else {
          res.render('admin/state/add-state');
      }
  })
}

exports.displayStates = function (req, res, next) {
    StateModel.find(function(err, db_states_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_states_array);
            //Render User Array in HTML Table
            res.render('admin/state/display-state', { mydata: db_states_array });
          }
      }).lean();
};

exports.deleteState = function (req, res, next){
    //var deleteid = req.params.id;
      StateModel.findByIdAndDelete(req.params.id, function(err, project) {
        if (err) {
          console.log("Error in Record Delete " + err);
            res.redirect('/state/display');
        } else {
          console.log(" Record Deleted ");
            res.redirect('/admin/state/display');
        }
    });
}

exports.editState =  function (req, res , next) {
    console.log(req.params.id);
    StateModel.findById(req.params.id, function(err, db_states_array) {
        if (err) {
            console.log("Edit Fetch Error " + err);
        } else {
            console.log(db_states_array);
            res.render('admin/state/edit-state', { mydata: db_states_array });
        }
    }).lean();
}

exports.editStateProcess =  function (req, res, next) {
    console.log("Edit ID is"+ req.params.id);
    const mybodydata = {
      state_name: req.body.state_name 
    }
  
    StateModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
        if (err) {
            console.log("Error in Record Update");
            res.redirect('/admin/state/display-state');
        } else {
          
            res.redirect('/admin/state/display');
        }
    });
}