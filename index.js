var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var csv = require('csvtojson');

require('dotenv/config');

var upload = multer({ dest: 'uploads/' });
var dumbledoresArmyModel = require('./model');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    dumbledoresArmyModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({ items: items });
        }
    });
});

app.post('/', upload.single('file'), (req, res, next) => {
    csv()
    .fromFile(req.file.path)
    .then((jsonObj)=>{
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            obj.firstName=jsonObj[i]['First Name'];
            obj.lastName=jsonObj[i]['Last Name'];
            obj.house=jsonObj[i]['House'];
            army.push(obj);
        }
        dumbledoresArmyModel.insertMany(army).then(function(){
            res.status(200).send({
                message: "Successfully Uploaded!"
            });
        }).catch(function(error){
            res.status(500).send({
                message: "failure",
                error
            });
        });
    }).catch((error) => {
        res.status(500).send({
            message: "failure",
            error
        });
    })
});

mongoose.connect(process.env.MONGO_URL,
{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
    console.log('Connected to database!')
});

app.listen('3000' || process.env.PORT, err => {
    if (err)
        throw err
    console.log('Server started!')
});