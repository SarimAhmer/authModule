const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const Role = new Schema({
	rolename: {
		type: String,
		require: true,
	},
	add: {
		type: Boolean,
		require: true,
		default: false
	},
	update: {
		type: Boolean,
		require: true,
		default: false
	},
	delete: {
		type: Boolean,
		require: true,
		default: false
	},
	view: {
		type: Boolean,
		require: true,
		default: true
	}
});
Role.plugin(passportLocalMongoose);

module.exports = mongoose.model('Role', Role);
