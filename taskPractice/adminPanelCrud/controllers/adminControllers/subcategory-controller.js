// Model Loading
const SubCategoryModel = require("../../schema/sub_category_table");
var CategoryModel = require('../../schema/category_table');


exports.addSubCategory = function (req, res, next) {
    CategoryModel.find(function(err, db_category_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_category_array);
            //Render User Array in HTML Table
            res.render('admin/subcategory/add-subcategory', { category_array : db_category_array });
          }
      }).lean();
};

exports.addSubCategoryProcess = async function(req, res, next){
    console.log(req.body);
 
    //Create an Array 
    const mybodydata = {
      sub_category_name: req.body.sub_category_name,
      _category: req.body._category
      }
      console.log("Name is "  + req.body.sub_category_name);
      console.log("ID is "  + req.body._category);
   
  var data = SubCategoryModel(mybodydata);
   
  data.save(function(err) {
      if (err) {
         console.log("Error in Insert Record");
      } else {
          res.redirect('add');
      }
  })
}


exports.displaySubCategories = function (req, res, next) {
    SubCategoryModel.find(function(err, db_subcategory_array){
        console.log(db_subcategory_array);
        if (err) res.json({message: 'There are no posts here.'});

        SubCategoryModel.find({}).lean()
        .populate('_category')
          .exec(function(err, db_subcategory_array) {
            console.log(db_subcategory_array);
            res.render("admin/subcategory/display-subcategory", { mydata: db_subcategory_array });
          })
      });
};

exports.deleteSubCategory = function (req, res, next){
    SubCategoryModel.findByIdAndDelete(req.params.id, function(err, project) {
        if (err) {
          console.log("Error in Record Delete " + err);
            res.redirect('/display');
        } else {
          console.log("Record Deleted ");
            res.redirect('/admin/subcategory/display');
        }
    });
}

exports.editSubCategory =  function (req, res , next) {
    console.log(req.params.id);
    SubCategoryModel.findById(req.params.id, function(err, db_subcategory_array) {
        if (err) {
            console.log("Edit Fetch Error " + err);
        } else {
            console.log(db_subcategory_array);
            CategoryModel.find(function(err,db_category_array){
              if(err){
                console.log(err)
              }else{
                if(req.body._id == db_category_array._id){
                  console.log("db_category_array is : ", db_category_array);
                  res.render('admin/subcategory/edit-subcategory', { subcategory_array: db_subcategory_array, category_array: db_category_array , selected: db_subcategory_array._category });
                }
              }
            }).lean();
        }
    }).lean();
}

exports.editSubCategoryProcess =  function (req, res, next) {
    console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    sub_category_name: req.body.sub_category_name,
    _category: req.body._category
  }

  SubCategoryModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/admin/subcategory/display');
      } else {
          res.redirect('/admin/subcategory/display');
      }
  });
}