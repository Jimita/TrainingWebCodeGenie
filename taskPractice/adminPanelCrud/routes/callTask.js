var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let inputValue = "50054446444812";
  let array = ["", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  var storeValue = [];
  var result = [];
  var splitValue = inputValue.split("");

  for (let storeData of splitValue) {
    if (storeValue.length == 0) {
      storeValue.push(storeData);
    } else {
      if (storeValue[0] == storeData) {
        storeValue.push(storeData);
      } else {
        if ((storeValue == 0) | (storeValue == 1)) {
          storeValue = [];
          storeValue.push(storeData);
        } else if (storeValue[1] == 0) {
          result.push(" ");
          storeValue = [];
          storeValue.push(storeData);
        }
        else {
          console.log("len of storevalue : ", storeValue.length);
          console.log("len of keypad : ", keypad.length);

          if(storeValue.length <= keypad.length){
            var keypad = array[storeValue[0] - 1].split("");
            result.push(keypad[storeValue.length - 1]);
            storeValue = [];
            storeValue.push(storeData);
            console.log("storeData : ", storeData);
            console.log("storeValue : ", storeValue);
          }else{
            console.log("not in range..");
          }
        } 
      }
    }
  }
  var keypad = array[storeValue[0] - 1].split("");
  result.push(keypad[storeValue.length - 1]);
  console.log("result : ", result);
});

module.exports = router;


// --------------------------------------

router.get("/singleOne", function (req, res, next) {

var inputData = [4,1,2,1,2,5,5,1];
var storeData = {};
for(item in inputData){
  // console.log("item is : ",inputData[item]);
  if (storeData[inputData[item]]) {
    storeData[inputData[item]] = storeData[inputData[item]] + 1
    console.log("...", storeData[inputData[item]]);
  } else {
    storeData[inputData[item]] = 1
    console.log("....", storeData[inputData[item]]);
  }
}
for (let index of Object.keys(storeData)) {
  console.log("index : ", index);
  console.log("count of storeData : ", storeData[index]);
  if (storeData[index] == 1) {
    console.log("Single Number is : ",index);
  }
}
console.log(storeData);
});

// -------------------------------------

router.get("/increase", function (req, res, next) {

  var inputData = [5,9,9,9];
  var addValue = 1;
  var value  = new Number(inputData.join("")) + addValue;
  var result = new String(value).split("");
  console.log(result);

  // var lastVal = inputData.pop();
  // inputData.push(lastVal + 1);
});
