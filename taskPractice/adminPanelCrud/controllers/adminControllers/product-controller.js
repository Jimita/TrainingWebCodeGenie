// Model Loading
const SubCategoryModel = require("../../schema/sub_category_table");
var CategoryModel = require('../../schema/category_table');
var ProductModel = require('../../schema/product_table');


exports.addProduct = function (req, res, next) {
    SubCategoryModel.find(function(err, db_product_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log("product array");
            console.log(db_product_array);
            //Render User Array in HTML Table
            res.render('admin/product/add-product', { product_array : db_product_array });
          }
      }).lean();
};

exports.addProductProcess = async function(req, res, next){
    console.log(req.body);
    var fileobject = req.files.product_Image;
    var filename = req.files.product_Image.name;
  //Create an Array 
  const mybodydata = {
    product_name: req.body.product_name,
    product_details: req.body.product_details,
     product_price: req.body.product_price,
      product_Image: filename,
    _subcategory: req.body._subcategory
    }
    console.log("Name is "  + req.body.product_name);
    console.log("Name is "  + req.body.product_Image);
    console.log("ID is "  + req.body._subcategory);
 
var data = ProductModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
    } else {
         fileobject.mv("public/productUploads/" + filename, function(err) {
                    if (err) throw err;
                    // res.send("File Uploaded");
                  res.redirect('add');
         });
    }
})
}


exports.displayProducts = function (req, res, next) {
    ProductModel.find(function(err, db_product_array){
        console.log(db_product_array);
        if (err) res.json({message: 'There are no posts here.'});

        ProductModel.find({}).lean()
        .populate('_subcategory')
          .exec(function(err, db_product_array) {
            console.log(db_product_array);
            res.render("admin/product/display-product", { mydata: db_product_array });
          })
      });
};

exports.deleteProduct = function (req, res, next){
    ProductModel.findByIdAndDelete(req.params.id, function(err, project) {
        if (err) {
          console.log("Error in Record Delete " + err);
            res.redirect('/display');
        } else {
          console.log("Record Deleted ");
            res.redirect('/admin/product/display');
        }
    });
}

exports.editProduct =  function (req, res , next) {
    console.log(req.params.id);
  ProductModel.findById(req.params.id, function(err, db_product_array) {
      if (err) {
          console.log("Edit Fetch Error " + err);
      } else {
          console.log(db_product_array);
          SubCategoryModel.find(function(err,db_subcategory_array){
            if(err){
              console.log(err)
            }else{
              console.log("db_subcategory_array", db_subcategory_array);
              res.render('admin/product/edit-product', { product_array: db_product_array, subcategory_array: db_subcategory_array});
            }
          }).lean();
      }
  }).lean();
}

exports.editProductProcess = async function (req, res, next) {
    console.log("Edit ID is"+ req.params.id);
    const imgObject = req.files
    const id = req.params.id
    if(!req.files){
      return ProductModel.findById(id).select("product_Image").then((product)=>{
  
        const mybodydata = {
          product_name: req.body.product_name,
          product_details: req.body.product_details,
          product_price: req.body.product_price,
         
          _subcategory: req.body._subcategory
        }
  
        ProductModel.findByIdAndUpdate(id, mybodydata).then(()=>{
          res.redirect("/admin/product/display")
        }).catch(err=>next(err))   
  
      }).catch((err)=>{
        next(err);
      })
    }else{
      const mybodydata = {
        product_name: req.body.product_name,
        product_details: req.body.product_details,
        product_price: req.body.product_price,
        product_Image: req.files.product_Image.name,
        _subcategory: req.body._subcategory
      }
  
      ProductModel.findByIdAndUpdate(id, mybodydata).then(()=>{
        res.redirect("/admin/product/display")
      }).catch(err=>next(err))
    }
}