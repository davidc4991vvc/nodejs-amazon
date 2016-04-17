var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");
var Schema = mongoose.Schema;

var productSchema = new Schema({
	category : {type : Schema.Types.ObjectId , ref : "Category"},
	name : String,
	price : Number,
	image : String,
});

productSchema.plugin(mongoosastic,{
	hosts:[
		'http://localhost:9200/'
	]
});

module.exports = mongoose.model("Product",productSchema);