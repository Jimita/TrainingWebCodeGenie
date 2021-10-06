exports.getForgotPassword = function (req, res, next) {
    res.render('forgot_password');
};

exports.getForgotPasswordProcess = function (req, res, next) {
    var email = req.body.user_email;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function(err, db_users_array) {

        console.log("Find One " + db_users_array);

        if (db_users_array) {
            var db_email = db_users_array.user_email;
            var db_password = db_users_array.user_password;

        }

        console.log("db_users_array.user_email " + db_email);
        console.log("db_users_array.user_password " + db_password);

        if (db_email == null) {
            console.log("If");
            res.end("Email not Found");
        } else if (db_email == email) {

            "use strict";
            const nodemailer = require("nodemailer");

            // async..await is not allowed in global scope, must use a wrapper
            async function main() {

                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let account = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: 'gmail', // true for 465, false for other ports
                    auth: {
                        user: 'test.jimita@gmail.com',
                        pass: 'TestJimita@49'
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'test.jimita@gmail.com', // sender address
                    to: db_email, // list of receivers
                    subject: "Forgot Password", // Subject line
                    text: "Hello your password is " + db_password, // plain text body
                    html: "Hello your password is " + db_password // html body
                };

                // send mail with defined transport object
                let info = await transporter.sendMail(mailOptions)

                console.log("Message sent: %s", info.messageId);

                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                res.end("Password Sent on your Email");

            }

            main().catch(console.error);



        } else {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }


    });
};

