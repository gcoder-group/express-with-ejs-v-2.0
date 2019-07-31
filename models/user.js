var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {
		type : String,
		required: true,
	},
	email: {
		type : String,
		required: true,
		unique: true,
	},
	password: {
		type : String,
		required: true,
	},
	mobile: {
		type : String,
		default: null	
	},
	status: {
        type: String,
        enum : ['new','active','suspended'],
        default: 'new',
    },
	user_type: {
		type : String,
		enum : ['client','user'],
        default: 'client',
	},
	role: {
		type : String,
		enum : ['admin','executive'],
        default: 'executive',
	},
	api_token: {
		type : String,
		required: true,
		unique: true,
	},
	photo: {
		type : String,
		default: null,
	},
	address: {
		type : String,
		default: null,
	},
	dob: {
		type : String,
		default: null,
	},
	city: {
		type : String,
		default: null,
	},
	state: {
		type : String,
		default: null,
	},
	zip: {
		type : String,
		default: null,
	},
	country: {
		type : String,
		default: null,
	},
	created_at: {
		type : Date,
		default: Date.now,
	},
	created_at: {
		type : Date,
		default: Date.now,
	},
	intro_id: {
		type : String,
		default: null,
	},
	referral_code: {
		type : String,
		default: null,
	},
	resetPasswordToken: {
		type : String,
		default: null,
	},
	resetPasswordExpires: {
		type : Date,
		default: null,
	},
});

userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.password);

}

module.exports = mongoose.model('User',userSchema)