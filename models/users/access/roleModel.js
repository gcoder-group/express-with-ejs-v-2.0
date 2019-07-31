var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var roleTemplateSchema = new Schema({
	name: {
		type : String,
		required: true,
		unique : true,
	},
	all: {
		type : Number,
		default: 0,
	},
	sort: {
		type : Number,
		default: 0,
	},
	status: {
		type : Number,
		default: 1,
	},
	created_by: {
		type : Schema.Types.ObjectId,
		ref:'User',
		default: undefined,
	},
	updated_by: {
		type : Schema.Types.ObjectId,
		ref:'User',
		default: undefined,
	},
	created_at: {
		type : Date,
		default: Date.now,
	},
	updated_at: {
		type : Date,
		default: undefined,
	}
});
module.exports = mongoose.model('roles',roleTemplateSchema)

