var permissionModel = require('../../../models/users/access/permissionModel')
//var slugify = require('slugify')
var async = require('async');



/*Load the page to show the list*/
exports.index = function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	var data = {
        title:'Permissions',
        page:'access/permissions/index',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	var permission = permissionModel.find(function (err,doc){
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
        title:'Permission Create',
        page:'access/permissions/entry',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }
   
    res.render(req.theme_user+'/layouts/index',data);
};

exports.store = function(req,res,next) {

	//validating the field
    req.checkBody('name','Name is required!').notEmpty();
	req.checkBody('display_name','Display Name is required!').notEmpty()
	
	
	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/users/permission/create');
	}

	var newPermission = new permissionModel()
	newPermission.name = req.body.name
	newPermission.display_name = req.body.display_name
	newPermission.sort = parseInt(req.body.sort)
	newPermission.status = 1
	newPermission.created_by = req.user._id
	newPermission.created_at = new Date()
	
	newPermission.save((errors,page)=>{
		if(errors){
			var messages = [];
			console.log(errors)
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('back')
		}

		var message = "Permission Added successfully!"
		req.flash('success',message)

		return res.redirect('/users/permission')
	})
};

exports.show = function(req, res,next) {
    
}; 

exports.edit = function(req, res,next) {
    var id = req.params.id
    
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	
	var data = {
        title:'Permission Edit',
        page:'access/permissions/edit',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	permissionModel.findById(id,(errors,doc)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('/users/permission')
		}
		data.doc = doc
		data.id = id

		res.render(req.theme_user+'/layouts/index',data);

    })





};

exports.update = function(req, res,next) {
    
    //validating the field
    req.checkBody('name','Name is required!').notEmpty();
	req.checkBody('display_name','Display Name is required!').notEmpty()

	var id = req.params.id

	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/users/permission/'+id+'/edit');
	}

	var query = {'_id':id};
	var update = { 
		name: req.body.name,
		display_name: req.body.display_name,
		sort: req.body.sort,
		updated_by: req.user.id,
		updated_at: Date.now(),
	};

	permissionModel.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
	    if (err) {
	    	//return res.send(500, { error: err })
	    	for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
	    	return res.redirect('/users/permission/'+id+'/edit');
	    };
	    //console.log(doc)
	    req.flash('success',"Permission updated successfully!");
	    return res.redirect('/users/permission');

	})


};

exports.destroy = function(req, res,next) {
    var id =  req.params.id

	permissionModel.findByIdAndRemove(id,(errors,result)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})

			var response = {
		    	status: 201,
		    	messages : messages,
		    }
		    return res.send(response);
		}

		var response = {
	    	status: 200,
	    	messages : ["Permission delete successfully!"]
	    }
	    return res.send(response);
    })

    
};





