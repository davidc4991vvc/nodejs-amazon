var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var User = require("../models/user");

//serialize and deserilize user
passport.serializeUser(function(user,done){
	done(null,user._id);
});

passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
		done(err,user);
	});
});

//middleware
passport.use("local-login",new localStrategy({
		usernameField : "email",
		passwordField : "password",
		passReqToCallback : true	
	},function(req,email,password,done){
		User.findOne({email:email},function(err,user){
			if(err) return done(err);

			if(!user){
				return done(null,false,req.flash("danger","No User has been found"));
			}
			console.log("comparing phase");
			if(!user.compare(password)){
				return done(null,false,req.flash("danger","Wrong Password"));
			}

			return done(null,user);
		});
	}
));

//custom function to validate
exports.isAuthenticated = function(req,res,done){
	if(req.isAuthenticated()){
		return done();
	}
	res.redirect('/login')
}