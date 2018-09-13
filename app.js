import express from "express";
import bodyParser from "body-parser";
import template from "./templates/main";

const version = Math.random().toString(36).substring(8);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api/version', function (req, res) {
    res.send({
        version
    });
});

app.get('/api/data', function (req, res) {
});

app.get('/', function (req, res) {
    res.send(template)
});

app.listen(3020, function () {
    console.log('TT listening on port 3020')
});