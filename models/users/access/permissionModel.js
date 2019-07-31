var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var permissionTemplateSchema = new Schema({
	name: {
		type : String,
		required: true,
	},
	display_name: {
		type : String,
		required: true,
	},
	sort: {
		type : Number,
		required: true,
	},
	status: {
		type : Number,
		required: true,
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
module.exports = mongoose.model('permissions',permissionTemplateSchema)

