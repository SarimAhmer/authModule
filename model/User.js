const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	salt: {
		type: String,
		require: true
	},
	fullname: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	userrole: {
		type: String,
		default: "user",
		require: true
	}

});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
