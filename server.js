require('rootpath')();
var fs = require('fs')
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var path = require('path')
var multer = require('multer')
//var upload = multer({dest: 'app/uploads/'})
// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));
 
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
 

/***************************************************************************************************
************* Note: I used both mongoskin and express.js to connect and store data *****************
************* on mongoDB, the reason is because Mongoskin is an awesome driver for *****************
************* mongoDB and it was already written. It is als seperated so that expre*****************
************* ss.js contains all of my product related posts/deletes/gets.         *****************
***************************************************************************************************/



// set default path and name for incoming images to my server through multer
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './app/uploads')
	},
	filename: function(req, file, callback) {
		console.log(file.filename)
		callback(null, req.body.productID + path.extname(file.originalname))
	}
})


// make '/app' default route
app.get('/', function (req, res) {
        return res.redirect('/app');
});


// intakes the file from my admin page to let users add product (will later add arrays for photos)
app.post('/newproduct',function(req, res) {
	var upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname)
            
			if (ext !== '.png' && ext !== '.PNG' && ext !== '.JPG' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				console.log("Not an acceptable image type")
                res.redirect('/');
			}
			callback(null, true)
		}
	}).single('userFile')
	upload(req, res, function(err) {
        req.body.url = req.file.filename
        console.log(req.body.url)
		db.collection('product').save(req.body, (err, doc) => {
          if (err) return console.log(err)
          console.log("added product to db")
          res.redirect('/');
	})
    
        }); 
});


//deletes picture based on url using path package var path = require('path')
app.delete('/app/removepic/:url', function (req, res) {
      var url = req.params.url
      console.log(req.params);
      var loc = './app/uploads/' + url  
   fs.unlink(loc,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
});
        });

//this actually makes the connection to my mongo DB and deletes the json associated with my image
app.delete('/app/deleteone/:id', function (req, res) {
      var id = req.params.id;
      console.log(id);
      db.collection('product').remove(
            { _id: mongo.helper.toObjectID(id) }, 
          function (err, doc) {
        res.json(doc);

        });
    });

// getting all the products! YAY!
app.get('/app/allproducts', function(req, res)  {
         db.collection('product').find().toArray(function(err, result) {
            if (err) return console.log(err)
             res.send(result)

           
          });
        });
   
     

// starts server
//first one sets up the app to run on your local network, just change 0.0.0.0 to whatever your home IP is and access your app from any device at '0.0.0.0:3000/app'
//var server = app.listen(3000, '0.0.0.0', function () {
//    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
//});
//The second server command listens on localhost only and keeps everything local to your current working environment
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});