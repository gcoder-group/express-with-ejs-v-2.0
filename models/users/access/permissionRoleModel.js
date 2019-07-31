var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var permissionRoleTemplateSchema = new Schema({
	permission_id: {
		type : Schema.Types.ObjectId,
		ref:'permissions',
	},
	role_id: {
		type : Schema.Types.ObjectId,
		ref:'roles',
	}
});
module.exports = mongoose.model('permission_role',permissionRoleTemplateSchema)

