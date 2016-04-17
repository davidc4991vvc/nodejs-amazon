var router = require("express").Router();
var User = require("../models/user");
var passport = require("passport");
var passportConfig = require("../config/passport");

router.get("/login",function(req,res){
	if(req.user) return res.redirect('/');

	res.render("user/login")
});

router.post("/login",passport.authenticate('local-login',{
	successRedirect : "/profile",
	failureRedirect: "/login",
	failureFlash : true
}));

router.get("/profile",function(req,res){
	res.render("user/profile");
});

router.get("/signup",function(req,res,next){
	res.render("user/signup",({title:"Sign up"}));
});

router.post("/signup",function(req,res,next){
	var userPost = req.body.User;

	User.findOne({email : userPost.email},function(err,existingUser){
		if(existingUser){
			req.flash('danger', 'email already exists');
			res.redirect("/signup");
		}else{
			var user = new User;
			user.profile.name = userPost.name;
			user.email = userPost.email;
			user.password = userPost.password;

			user.save(function(err){
				if(err) return next(err);

				req.logIn(user,function(err){
					req.flash('success', 'New User created Successfully');
					res.redirect("/profile");
				});

			});
		}
	});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;