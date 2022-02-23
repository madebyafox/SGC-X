// --- LOADING MODULES
const express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');

// --- INSTANTIATE THE APP
const app = express();

// --- DB DRIVERS
var emptySchema = new mongoose.Schema({}, { strict: false }); //schemaless db
var Entry = mongoose.model('Entry', emptySchema);

//DB CONNECTION STRING
var x = 'mongodb://localhost/local_SGCX'; //FOR LOCAL
// var x = process.env.CONNECTION; //FOR SERVER

//ORIGINAL DB LOGIC -------------------------
mongoose.connect(x); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});
//--------------------------------------------------

//————— NEW DB CONNECTION LOGIC———————————————————————————
// mongoose default connection logic now deprecated
//https://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client

// var promise = mongoose.connect(x, { 
//     useMongoClient: true,
//     /* other options */
//   });

//SERVER 
// Using `mongoose.connect`...
// var promise = mongoose.connect(process.env.CONNECTION, { //FOR SERVER
//     useMongoClient: true,
//     /* other options */
//   });
  
//   promise.then(function(db) {
//     // /* Use `db`, for instance `db.model()`
//     db.on('error', console.error.bind(console, 'connection error'));
//     db.once('open', function callback() {
//       console.log('database opened');
//     });
//   });
//---------------———————----------------------------------

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/public'));

// --- BODY PARSING MIDDLEWARE
app.use(body_parser.json({limit: '500mb'}));

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
// app.set('', __dirname + '/public');
app.set('jspsych7', __dirname + '/public/jspsych7');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING

//GET PAGES
app.get('/', function(request, response) {
    response.render('index.html');
});

//POST DATA
app.post('/experiment-data', function(request, response){
    Entry.create({
        "data":request.body
    });
    response.end();
})


// --- START THE SERVER
// var server = app.listen(process.env.PORT, function(){ //SERVER VERSION
var server = app.listen(5050, function(){ //LOCAL VERSION
    console.log("Listening on port %d", server.address().port);
});
