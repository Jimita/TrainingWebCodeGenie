$(document).ready(function () {
  // get all files data from db
  function fileData() {
    $.ajax({
      type: "GET",
      url: "/displayFile"
    }).done(function (data) {
      console.log("fileData is : ", data);
      let str = '';
      for (let item of data.fileData) {
        str += `<tr><td>${item.name}</td> <td>${item.skipFirstRow}</td><td>${item.totalRecords}</td><td>${item.totalUploaded}</td><td>${item.duplicates}/${item.discarded}</td><td>${item.status}</td></tr>`
      }
      $("#fileData").html(str)
    });
  }
  // setInterval(function () {
  //   $("#fileData").html("")
  //   fileData();
  // }, 3000);

  function openModal(data) {
    console.log("modal open", data);
    $("#filenameId").replaceWith(
      "<input type='hidden' value=" +
      data.data.filename +
      "  id='filenameId' class='filenameClass'/>"
    );
    let options = "";
    for (let field of data.data.alldbFields) {
      options = options + `<option value='${field}'>${field}</option>`;
    }
    for (let index = 0; index < data.data.firstRow.length; index++) {
      $("#tbody").append(
        "<tr class='table-info field' id=" +
        data.data.csvField[index] +
        "> <td>" +
        data.data.firstRow[index] +
        "</td> <td>" +
        data.data.secondRow[index] +
        "</td> <td>  <select name='' class='form-select selectClass mappingClass'id=" +
        data.data.csvField[index] +
        "-dropdown > <option value=''>Select Value</option> " +
        options +
        " <option id='selected-option' value='addField'>Add Field</option> </select></td></tr>"
      );
    }
  }
  // validation for add user
  $("#formid").validate({
    rules: {
      name: "required",
      email: "required",
      mobile: "required",
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      name: "Name is required",
      email: "Email is required",
      mobile: "Mobile is required",
      password: {
        password: "Password is required",
        minlength: "Password must be at least 6 characters long",
      },
    },
    errorPlacement: function (error, element) {
      if (element.attr("id") == "nameid") {
        error.insertAfter(".name");
      } else if (element.attr("id") == "emailid") {
        error.insertAfter(".email");
      } else if (element.attr("id") == "mobileid") {
        error.insertAfter(".mobile");
      } else if (element.attr("id") == "passwordid") {
        error.insertAfter(".password");
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      const formData = {
        name: $("#name").val(),
        email: $("#email").val(),
        mobile: $("#mobile").val(),
        password: $("#password").val(),
      };
      console.log("formData...", formData);
      // ajax call
      $.ajax({
        type: "POST",
        url: "/addUser",
        data: formData,
      }).done(function (data) {
        console.log("data is : ", data);
        location.reload();
      });
    },
  });

  //validation for login form
  $("#loginForm").validate({
    rules: {
      name: "required",
      password: "required",
    },
    messages: {
      name: "Name/Email/Mobile is required",
      password: "Password is required",
    },
    errorPlacement: function (error, element) {
      if (element.attr("id") == "nameid") {
        error.insertAfter(".name");
      } else if (element.attr("id") == "passwordid") {
        error.insertAfter(".password");
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      const formData = {
        name: $("#name").val(),
        password: $("#password").val(),
      };
      console.log("formData...", formData);
      // ajax call
      $.ajax({
        type: "POST",
        url: "/api/login",
        data: formData,
      }).done(function (data) {
        console.log("data is : ", data);
        if (data.status == 200) {
          // $(document)[0].cookie = `token = ${data.token}`;
          // $("#userDiv").load("http://127.0.0.1:4000/api/userList", function(){
          //   $(".container").remove();
          // })
          $(location).attr("href", "/api/userList");
        } else {
          $("#errorMessage").html(data.message);
        }
      });
    },
  });

  //   import csv
  $("#importFormId").validate({
    rules: {
      importCsv: {
        required: true,
        extension: "csv",
      },
    },
    messages: {
      importCsv: {
        required: "Please upload file.",
        extension: "Please upload file in these format only CSV.",
      },
    },
    errorPlacement: function (error, element) {
      if (element.attr("id") == "importCsv") {
        error.insertAfter(".imp");
      } else {
        error.insertAfter(element);
      }
    },

    submitHandler: function (form, event) {
      event.preventDefault();
      // var formData = {
      //   // importCsv: $("#importCsv").val(),
      //   importCsv :$("#importCsv")[0].files[0]
      // };
      formData = new FormData();
      formData.append("importCsv", $("#importCsv")[0].files[0]);
      // ajax call
      $.ajax({
        type: "POST",
        url: "/import",
        data: formData,
        processData: false,
        contentType: false,
      }).done(function (data) {
        if (data) {
          console.log("import data ", data);
          openModal(data);
          let fieldMap = {};
          let dbField;
          let objValidation = {};
          // dropdown validation on change
          $(".selectClass").change(function () {
            var $this = $(this);
            if (
              $(this).val() ==
              "addField"
            ) {
              // $("#myModal").hide();
              // add new field in dropdown using popup
              var userName = window.prompt("Add New Field", "Text");
              if (userName != null) {
                var myObj = {
                  field: userName,
                };
                console.log("myobj", myObj);
                $.ajax({
                  url: "/fieldAdd",
                  type: "POST",
                  data: myObj,
                }).done(function (data) {
                  console.log("dataaaa", data);
                  if (data.type == "success") {
                    // append added field in dropdown
                    $(".form-select").append(
                      `<option value='${myObj.field}'>${myObj.field}</option>`
                    );
                    // set new field as default in selected dropdown
                    $this.val(myObj.field).prop("selected", true);
                  }
                });
              } else {
                alert("Name is Null");
              }
              return;
            }
            // dropdown validation

            if (objValidation.hasOwnProperty($(this).val())) {
              $.toast({
                heading: 'Error',
                text: 'Already Selected.. Kindly choose another Field.',
                icon: 'warning',
                loader: true, // Change it to false to disable loader
                loaderBg: '#9EC600' // To change the background
              })
              let prev = $(this).attr("name");
              $(this).val(prev).attr("selected", true)
            } else {
              let prev = $(this).attr("name");
              $(this).attr("name", $(this).val())
              if ($(this).val() == '') {
                delete objValidation[prev]
              } else {
                delete objValidation[prev]
                objValidation[$(this).val()] = 1
              }
            }
          });
        }
      });

      $("#upload").on("click", function () {
        // $("#upload").validate({
        //     rules: {
        //       select_field:{
        //           required: {
        //               depends: function(element){
        //                   if('none' == $('.selectClass').val()){
        //                       //Set predefined value to blank.
        //                       $('.selectClass').val('');
        //                   }
        //                   return true;
        //               }
        //           }
        //       }
        //   },
        //   messages: {
        //     select_field: {
        //       required: "Please select field."
        //     },
        //   },
        // })
        let fieldMap = {};
        $(".mappingClass").each(function () {
          let dbField = $(this).val();
          let checkboxval = $(this).closest('tr.field').attr('id');
          console.log("checkboxval0------------------------");
          console.log(checkboxval);
          console.log("dbField");
          console.log(dbField);
          if (dbField) {
            fieldMap[dbField] = checkboxval;
          }
        });

        var fileName = $("#filenameId").val();
        // fieldMap["file_id"] = fileName
        console.log("obj ", fieldMap, fileName);
        // if(fieldMap)
        let headerOrNot;
        headerOrNot = $('input[name="headerOrNot"]:checked').val();
        console.log("headerOrNot", headerOrNot);

        $.ajax({
          // url: "/mapping/" + fileName,
          url: "/mapping/" + fileName + "/" + headerOrNot,
          method: "PUT",
          data: fieldMap,
          success: function (data) {
            console.log(data);
            $("#myModal").modal("hide");
            $("#tbody").html("")
          },
        });
      });
    },
  });
  $("#logout").click(function () {
    $.ajax({
      type: "GET",
      url: "/logout",
    }).done(function (data) {
      console.log("data is : ", data);
      if (data.status == "success") {
        $(location).attr("href", "/loginUser");
      } else {
        $("#errorMessage").html(data.message);
      }
    });
  });
});

// $(document).on("click", ".selectClass", function () {
//   if ( $(this).data('clicks') == 1 ) {
//     // Trigger here your function:
//     console.log('Selected Option: ' + $(this).val() );
//     $(this).data('clicks', 0);
// } else {
//     console.log('Cannot select Same Name..');
//     $(this).data('clicks', 1);
// }
// });

// csv export
$(document).on("click", ".csv", function () {
  var exportData = {
    exportId: $(this).attr("id"),
  };
  console.log(exportData);
  $.ajax({
    url: "/api/userList",
    method: "GET",
    data: exportData,
  }).done(function (data) {
    console.log("data", data);
    var link = $("<a />");
    link.attr("download", data.file);
    let url = "http://127.0.0.1:4000/exports/" + data.file;
    link.attr("href", url);
    $("body").append(link);
    link[0].click();
    $("body").remove(link);
  });
});