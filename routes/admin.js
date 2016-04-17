var router = require("express").Router();
var Category = require("../models/category");
var Product = require("../models/product");
var async = require("async");
var faker = require("faker");
// check is Logged In;
router.use(function(req,res,done){
	if(!req.user)
		res.redirect("/");
	return done();
});

router.get("/addCategory",function(req,res,done){
	res.render("admin/add-category");
});

router.post("/addCategory",function(req,res,done){
	var category = new Category();
	category.name = req.body.name;

	category.save(function(err){
		if(err) return done(err);
		req.flash("success","Category Created Successfully");
		res.redirect("/addCategory");
	});
});
module.exports = router;