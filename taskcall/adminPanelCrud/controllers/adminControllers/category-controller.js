// Model Loading
const CategoryModel = require("../../schema/category_table");


exports.addCategory = function (req, res, next) {
    res.render('admin/category/add-category');
    // console.log("my url is : ",req.url);
};

exports.addCategoryProcess = async function(req, res, next){
    console.log(req.body);

  //Create an Array 
  const mybodydata = {
    category_name: req.body.category_name
  
  }
    try {
        var data = CategoryModel(mybodydata);
        const category = await data.save()  
        console.log(category);
        res.render('admin/category/add-category');
    } catch (error) {
        next(error);
    }
// data.save(function(err) {
//     if (err) {
//        console.log("Error in Insert Record");
//     } else {
//         
//     }
// })
}


exports.displayCategories = function (req, res, next) {
      CategoryModel.find(function(err, db_users_array) {
    if (err) {
        console.log("Error in Fetch Data " + err);
      } else {
        //Print Data in Console
        console.log(db_users_array);
        //Render User Array in HTML Table
        res.render('admin/category/display-category', { mydata: db_users_array });
      }
  }).lean();
};

exports.deleteCategory = function (req, res, next){
    //var deleteid = req.params.id;
    CategoryModel.findByIdAndDelete(req.params.id, function(err, project) {
        if (err) {
          console.log("Error in Record Delete " + err);
            res.redirect('/admin/category/display');
        } else {
          console.log(" Record Deleted ");
            res.redirect('/admin/category/display');
        }
    });
}

exports.editCategory =  function (req, res , next) {
    console.log("edit id is : ",req.params.id);

    //CategoryModel.find({id:req.params.id}).then().catch()


    CategoryModel.findById(req.params.id, function(err, db_category_array) {
        if (err) {
            console.log("Edit Fetch Error " + err);
        } else {
            console.log(db_category_array);
            res.render('admin/category/edit-category', { category_array: db_category_array });
        }
    }).lean();
}

exports.editCategoryProcess =  function (req, res, next) {
    console.log("Edit ID is"+ req.params.id);

    const mybodydata = {
      category_name: req.body.category_name 
    }
  
    CategoryModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
        if (err) {
            console.log("Error in Record Update");
            res.redirect('/admin/category/display-category');
        } else {
          
            res.redirect('/admin/category/display');
        }
    });
}