var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bannerTemplateSchema = new Schema({
	banner_title: {
		type : String,
		required: true,
	},
	banner_content: {
		type : String,
		required: true,
	},
	banner_image: {
		type : String,
		required: true,
	},
	banner_status: {
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
module.exports = mongoose.model('banners',bannerTemplateSchema)