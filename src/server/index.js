const express = require('express');
var BodyParser = require("body-parser");
var Request = require("request");
const os = require('os');

const app = express();
var PRIVATE_KEY = '6LcofWgaAAAAAMOB8FblnUn7cd8mxFW3v-jZJWXn';

app.use(express.json());
app.use(express.static('dist'));
let a = null;
let b = null;
app.get('/api/getUsername', (req, res) => res.send({username: "ABC"}));
app.get('/api/getRandomAandB', (req, res) => {
    a = Math.ceil(Math.random() * 10);
    b = Math.ceil(Math.random() * 10);
    res.send({a: a, b: b});

});
//validate captcha and check sum a+b
app.post('/api/sendResult', (req, res) => {
    const check = (req.body.data.result === (a + b) ? true : false) || false;

    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    console.log("req.body",req.body)
    recaptcha_url += "secret=" + PRIVATE_KEY + "&";
    recaptcha_url += "response=" + req.body.data.valueCaptcha + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    console.log("recaptcha_url",recaptcha_url)
    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        console.log("body",body)
        if( (body.success !== undefined && !body.success) || !check ) {
            res.send({check:false})
        } else {
            res.send({check: true});
        }
    });
})


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

