var roleModel = require('../../../models/users/access/roleModel')
var permissionModel = require('../../../models/users/access/permissionModel')
var permissionRoleModel = require('../../../models/users/access/permissionRoleModel')
var async = require('async');
var check = require('check-types');



/*Load the page to show the list*/
exports.index = function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	var data = {
        title:'Roles',
        page:'access/roles/index',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	var role = roleModel.find(function (err,doc){
	    if(err){
	    	data.doc = {}
	    }else{
	    	data.doc = doc
	    }
	    res.render(req.theme_user+'/layouts/index',data);
	});
    
};


exports.create = function(req, res,next) {
    
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	
	var data = {
        title:'Role Create',
        page:'access/roles/entry',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }
   	var permission = permissionModel.find(function (err,doc){
	    if(err){
	    	data.permissions = {}
	    }else{
	    	data.permissions = doc
	    }
	    //console.log(data.permissions);
	    res.render(req.theme_user+'/layouts/index',data);
	});
    
};

exports.store = function(req,res,next) {
	
	//validating the field
    req.checkBody('name','Name is required!').notEmpty();
    
    if(req.body.associated_permissions == 0 && req.body.custom_permissions != undefined){
		req.checkBody('custom_permissions','Atleast one permission is required!').isLength({min:1});
	}
	var errors = req.validationErrors(); 
	
	if(errors){
		var messages = [];
		erros.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/users/roles/create');
	}

	var roledetail = roleModel.findOne({ name: req.body.name },function (err,doc){
	    if(err){
	    	var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('back')
	    }
	    if(doc){
	    	console.log('Name is already exist!')
	    	req.flash('error',['Name is already exist!']);
			return res.redirect('/users/roles/create');
		}


	    var newRole = new roleModel()
		newRole.name = req.body.name
		newRole.all = req.body.associated_permissions
		newRole.sort = (parseInt(req.body.sort))?req.body.sort:0
		newRole.status = req.body.status
		newRole.created_by = req.user._id
		newRole.created_at = new Date()
	
		newRole.save((errors,doc)=>{
			if(errors){
				var messages = [];
				errors.forEach(function(error){
					messages.push(error.msg)
				})
				req.flash('error',messages);
				return res.redirect('back')
			}
			if(req.body.associated_permissions == 0){
				//Adding the new permission roles
		    	var custom_permissions = req.body.custom_permissions

		    	if(check.array(custom_permissions)==true){
		    		var data = []
		    		custom_permissions.forEach(function(value){
		    			var obj = {};
		    			obj.permission_id = value
		    			obj.role_id = doc._id
		    			data.push(obj)
		    		})

		    		permissionRoleModel.insertMany(data,(err,docs)=>{
		    			if(err){
							var messages = [];
							err.forEach(function(error){
								messages.push(error.msg)
							})
							req.flash('error',messages);
							return res.redirect('back')
						}
						var message = "Role Added successfully!"
						req.flash('success',message)
						return res.redirect('/users/roles')

		    		})
		    	}else{
		    		var newPermissionRole = permissionRoleModel()
					newPermissionRole.permission_id = custom_permissions
					newPermissionRole.role_id = doc._id
		    		
		    		newPermissionRole.save(data,(err,docs)=>{
		    			if(err){
							var messages = [];
							err.forEach(function(error){
								messages.push(error.msg)
							})
							req.flash('error',messages);
							return res.redirect('back')
						}
						var message = "Role Added successfully!"
						req.flash('success',message)
						return res.redirect('/users/roles')

		    		})
		    	}
					
			}else{
				var message = "Role Added successfully!"
				req.flash('success',message)

				return res.redirect('/users/roles')
			}
		})


	    
	});


	
};

exports.show = function(req, res,next) {
    
}; 

exports.edit = function(req, res,next) {
    var id = req.params.id
    
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	
	var data = {
        title:'Role Edit',
        page:'access/roles/edit',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	roleModel.findById(id,(errors,doc)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('/users/roles')
		}
		data.doc = doc
		data.id = id

		var permission = permissionModel.find(function (err,doc){
		    if(err){
		    	data.permissions = {}
		    }else{
		    	data.permissions = doc
		    }
		    
		    // res.render(req.theme_user+'/layouts/index',data);
		    var permissionRole = permissionRoleModel.find({role_id:id},function (err,doc2){
			    if(err){
			    	data.permissions_role = {}
			    }else{
			    	data.permissions_role = doc2
			    }
			    
			    res.render(req.theme_user+'/layouts/index',data);
			});
		});
	})
};

exports.update = function(req, res,next) {
    
    //validating the field
    req.checkBody('name','Name is required!').notEmpty();
    
    if(req.body.associated_permissions == 0 && req.body.custom_permissions != undefined){
		req.checkBody('custom_permissions','Atleast one permission is required!').isLength({min:1});
	}

	var id = req.params.id

	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/users/roles/'+id+'/edit');
	}

	var query = {'_id':id};
	var update = { 
		name: req.body.name,
		all: req.body.associated_permissions,
		sort: (parseInt(req.body.sort))?req.body.sort:0,
		status: req.body.status,
		updated_by: req.user.id,
		updated_at: Date.now(),
	};

	roleModel.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
	    if (err) {
	    	//return res.send(500, { error: err })
	    	for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
	    	return res.redirect('/users/roles/'+id+'/edit');
	    };

	    if(req.body.associated_permissions == 0){
		    // deleting the permission roles
		    remove_res = permissionRoleModel.deleteMany({ role_id : id},(err3, doc3)=>{
		    	if (err3) {
			    	return res.send(500, { error: err3 })
			    };
			    //updating the new permission roles
		    	var custom_permissions = req.body.custom_permissions

		    	if(check.array(custom_permissions)==true){
		    		var data = []
		    		custom_permissions.forEach(function(value){
		    			var obj = {};
		    			obj.permission_id = value
		    			obj.role_id = doc._id
		    			data.push(obj)
		    		})

		    		permissionRoleModel.insertMany(data,(err,docs)=>{
		    			if(err){
							var messages = [];
							err.forEach(function(error){
								messages.push(error.msg)
							})
							req.flash('error',messages);
							return res.redirect('back')
						}
						var message = "Role updated successfully!"
						req.flash('success',message)
						return res.redirect('/users/roles')

		    		})
		    	}else{
		    		var newPermissionRole = permissionRoleModel()
					newPermissionRole.permission_id = custom_permissions
					newPermissionRole.role_id = doc._id
		    		
		    		newPermissionRole.save(data,(err,docs)=>{
		    			if(err){
							var messages = [];
							err.forEach(function(error){
								messages.push(error.msg)
							})
							req.flash('error',messages);
							return res.redirect('back')
						}
						var message = "Role updated successfully!"
						req.flash('success',message)
						return res.redirect('/users/roles')

		    		})
		    	}
			});
		}else{
			var message = "Role Added successfully!"
			req.flash('success',message)

			return res.redirect('/users/roles')
		}
	 })


};

exports.destroy = function(req, res,next) {
    var id =  req.params.id

	roleModel.findByIdAndRemove(id,(errors,result)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})

			//deleteing the permission roles
			remove_res = permissionRoleModel.deleteMany({ role_id : id},(err3, doc3)=>{
		    	if (err3) {
			    	return res.send(500, { error: err3 })
			    };
			    var response = {
			    	status: 201,
			    	messages : messages,
			    }
			    return res.send(response);
			});

			
		}

		var response = {
	    	status: 200,
	    	messages : ["Role delete successfully!"]
	    }
	    return res.send(response);
    })

    
};





