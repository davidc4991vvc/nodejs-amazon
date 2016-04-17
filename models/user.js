var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var Schema = mongoose.Schema;
// define user schema properties
var UserSchema = new Schema({
	email : { type: String,unique:true , lowercase: true},
	password : String,

	profile : {
		name : {type: String , default : ""},
		picture : {type : String , default : ""},
		address : {type : String , default : ""}
	},

	history : [{
		date : Date,
		paid : {type : Number , default : 0},
		item : {type : Schema.Types.ObjectId , ref: ""}
	}]
});

//hash password before save
UserSchema.pre('save',function(next){
	var user = this;
	if(!user.isModified("password")) return next(); 
	bcrypt.genSalt(10,function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) return nect(err);
			user.password = hash;
			next();
		});
	});
});

//make the compare methods
UserSchema.methods.compare = function(password){
	return bcrypt.compareSync(password , this.password);
}

module.exports = mongoose.model("User",UserSchema);