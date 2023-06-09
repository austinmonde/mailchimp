const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.emailAddress;
    
    const data = {
        members: [ {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/0af9d8f4a2";

    const options = {
        method: "POST",
        auth:"austin:b78c8bf4f1215576f9016c9c289a4855-us11"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            //console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("server up and running on port 3000.");
});


// api-key
// b78c8bf4f1215576f9016c9c289a4855-us11

// audience-id
// 0af9d8f4a2