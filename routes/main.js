var router = require("express").Router();
var async = require("async");
var Category = require("../models/category");
var Product = require("../models/product");

Product.createMapping(function(err,mapping){
	if(err){
		console.log("Error Mapping");
		console.log(err);
	}else{
		console.log("Mapping");
		console.log(mapping);
	}
});

//sync whole data from products to elastic search
var stream = Product.synchronize();
var count = 0;

stream.on("data",function(){
	count++;
});

stream.on("close",function(){
	console.log("Indexed "+count+" documents");
});

stream.on("error",function(err){
	console.log(err);
});

var paginate = function(req,res,next){
	perPage = 9;
	page = req.params.page;
	if(typeof page == "undefined"){
		page = 1;
	}

	Product
		.find()
		.skip((page-1)*perPage)
		.limit(perPage)
		.populate('category')
		.exec(function(err,products){
			if(err) return next(err);
			Product.count().exec(function(err,count){
				if(err) return next(err);
				res.render('index/index',{products:products,count:count/perPage,page:page});
			});
		});
}
router.get("/",paginate);
router.get("/products/page/:page",paginate);

router.get("/viewCategory/:name",function(req,res,next){
	async.waterfall([
		function(callback){
			Category.findOne({name : req.params.name},function(err,category){
				if(err) return next(err);
				callback(null,category);
			});
		},function(category,callback){
			Product.find({category : category._id})
					.populate("category")
					.exec(function(err,products){
						if(err) return next(err);

						res.render('admin/view-category',{products:products,category:category});
					});
		}
	]);
});

router.post("/search",function(req,res,next){
	res.redirect("/search?q="+req.body.q);
});

router.get("/search",function(req,res,next){
	Product.search({
		query_string : {query : req.query.q}
	},{hydrate:true},function(err,results){
		if(err) return next(err);
		console.log(results);
		var data = results.hits.hits.map(function(hit){
			console.log(hit);
			return hit;
		});
		res.render('index/search-results',{query: req.query.q, data:data});
	});
});

router.get('/product/:id',function(req,res,next){
	Product.findById(req.params.id).populate('category').exec(function(err,product){
		if(err) return next(err);
		res.render('index/product',{product:product})
	});
});


module.exports = router;