const bodyParser = require("body-parser");
const https = require("https");
const express = require("express");
const { subscribe } = require("diagnostics_channel");
// const request = require("request");
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.get("/", function(req,res){

    res.sendFile(__dirname + "/signup.html")
})


app.post("/",function(req,res){
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fiels: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    // To make the data in a plain text
    const jsonData = JSON.stringify(data);

    // Now making request
    const url = "https://us9.api.mailchimp.com/3.0/lists/dbdb6ae1b9";
    const option = {
        method: "POST",
        auth: "akash:0447dde00143d782158245a2e0fa5558-us9"
    }
    const request = https.request(url,option,function(response){

        // Checking response code to get a confirmation 
        // Lect - 225
        if (response.statusCode == 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    // request.write(jsonData);
    request.end();

    
});

// Using try again button 
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.")
})

// API Key
// 0447dde00143d782158245a2e0fa5558-us9

// List id
// dbdb6ae1b9