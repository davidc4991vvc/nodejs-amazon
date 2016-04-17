var express = require("express");
var app = express();
var path = require("path");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser"); 
var session = require("express-session"); 
var flash = require("express-flash"); 
var mongoStore = require("connect-mongo/es5")(session);
var passport = require('passport');
var Category = require("./models/category");

var mainRoutes = require("./routes/main");
var userRoutes = require("./routes/user");
var adminRoutes = require("./routes/admin");

mongoose.connect("mongodb://localhost/amazon",function(err){
	if(err) console.log("Error connecting Database");
	else console.log("Connected to database");
});
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","jade");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	store : new mongoStore({url : "mongodb://localhost/amazon",autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(function(req,res,next){
	app.locals.req = req;
	next();
});

app.use(function(req,res,next){
	Category.find({},function(err,categories){
		if(err) return next(err);
		app.locals.categories = categories;
		next();
	});
});

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);


app.listen(3000,function(err){
	if(err) throw err;
	console.log("Connected to server Now");
});