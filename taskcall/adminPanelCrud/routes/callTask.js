var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  var inputData = "22234";
  var storeValue = undefined;
  var counter = 0;
  var result = [];
  var res;
  var keypad = {
    1: "0_0",
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };
  var splitValue = inputData.split("");
  var finalSplit = splitValue[0];
  var keys = Object.keys(keypad);

  console.log("inputvalue is : ", inputData);
  console.log("splitValue is : ", splitValue);
  // console.log("splitValue[0] is : ", finalSplit);

  for (value of splitValue) {
    console.log("loop value ",value);
    if (storeValue == undefined) {
      storeValue = value;
    }
    if (storeValue == value) {
      storeValue = value;
      counter++;
      console.log("couter", counter);

    } else {
      for (let data in keypad) {
        var keySplit = keys[data].split("");
        if (keySplit == storeValue) {
          var final = keySplit - 1;
          var splitData = keypad[keys[final]].split("");
          result.push(splitData[counter - 1]);
          console.log("result", result);
          storeValue = value;
          counter = 0;
          console.log("store value",storeValue);
          console.log("value",counter);

        }
      }
    }
    
  }
});


module.exports = router;
