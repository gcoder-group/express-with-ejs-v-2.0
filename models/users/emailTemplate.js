var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var emailTemplateSchema = new Schema({
	email_subject: {
		type : String,
		required: true,
	},
	email_body: {
		type : String,
		required: true,
	},
	created_at: {
		type : Date,
		default: Date.now,
	},
	updated_at: {
		type : Date,
		default: Date.now,
	}
});
module.exports = mongoose.model('EmailTemplate',emailTemplateSchema)