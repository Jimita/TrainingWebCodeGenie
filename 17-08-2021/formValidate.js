const formValidate = () => {
    var name = document.myform.name.value;
    var password = document.myform.password.value;

    // validating name
    if (name == null || name == "" || (name.length > 2 && name.length < 10)) {
        // alert("Name can't be blank or Name length must be between 2 to 10 ");
        document.getElementById("lbluser").style.visibility = "visible";
        name.style.border = "solid 3px red";
        return false;
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        name.focus();
        return false;
    }

    //validating email
    var x = document.myform.email.value;
    var atposition = x.indexOf("@");
    var dotposition = x.lastIndexOf(".");
    if (
        atposition < 1 ||
        dotposition < atposition + 2 ||
        dotposition + 2 >= x.length
    ) {
        alert(
            "Please enter a valid e-mail address \n atpostion:" +
            atposition +
            "\n dotposition:" +
            dotposition
        );
        email.focus();
        return false;
    }

    //validating radio button
    if (
        document.myform.gender[0].checked == false &&
        document.myform.gender[1].checked == false
    ) {
        alert("Please choose your Gender: Male or Female");
        return false;
    }

    //validation for checkBox
    if (!this.myform.checkbox.checked) {
        alert("You must agree to the terms first.");
        return false;
    }
    //  validating password
    var firstpassword = document.myform.password.value;
    var secondpassword = document.myform.password2.value;

    if (firstpassword == secondpassword) {
        return true;
    } else {
        alert("password must be same!");
        firstpassword.focus();
        return false;
    }
};

const cancelbtn = () => {
    document.myform.name.value = "";
    document.myform.password.value = "";
    document.myform.email.value = "";
    document.myform.password.value = "";
    document.myform.password2.value = "";
    document.myform.description.value = "";
    document.myform.birth_date.valueAsDate = null;
    document.myform.age.value = null;
    document.myform.checkbox.checked = false;
    document.myform.gender[0].checked = false;
    document.myform.gender[1].checked = false;
};