
exports.getHome = function (req, res, next) {
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var myid = req.session._id;
    console.log(myemail);
    console.log("your id is : ",myid);

    //Auth
    if (!req.session.email) {
        console.log("Email Session is Set");
        res.end("Login required to Access this page");
    }
    res.render('home', { myemail: myemail , myid: myid});
};
