var User = require('../../../models/user')
var roleModel = require('../../../models/users/access/roleModel')
var permissionModel = require('../../../models/users/access/permissionModel')
var permissionRoleModel = require('../../../models/users/access/permissionRoleModel')
var crypto = require('crypto');
var config_app = require('../../../config/app')


/*Load the page to show the list*/
exports.index = async function(req, res,next) {
	var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	var data = {
        title:'Users',
        page:'access/users/index',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	var user = await  User.find({role:'admin'},function (err,users){
	    if(err){
	    	data.products = {}
	    	data.hasUsers = false
	    	res.render('users/users/index',data)
	    }
	    data.users = users
	    data.hasUsers = true
	    
	    res.render(req.theme_user+'/layouts/index',data);
	});

    
};

exports.create =  function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

    var data = {
		title:'User Create',
		page:'access/users/entry',
    	csrfToken: req.csrfToken(),
    	successMsg: successMsg,
    	errorMsg: errorMsg,
    };
    data.roles = {}
    data.role_user_id = config_app.role_user_id
    
    var roles = roleModel.find({'status':1},(err2,docs)=>{
    	if(err2){
	    	return res.json(err2)
	    }
	    data.roles = docs
	    permission_role = [];
	    
	    permissionRoleModel.find().populate('permission_id'). // only return the Persons name
	  	exec(function (err, permission_role) {
		    if (err) return res.json(err);

		    data.permission_role = permission_role
		    return res.render(req.theme_user+'/layouts/index',data);
	  	});
	    
		

		
	    
	    
	   
    }).sort('sort');
    
	
};

exports.store = function(req,res,next) {
	//validating the field
	var body = req.body;
    req.checkBody('name','Name is required!').notEmpty();
	req.checkBody('email','Email is required!').notEmpty()
	req.checkBody('password','Password is required!!').notEmpty()
	req.checkBody('mobile','Mobile number is required!!').notEmpty()


	User.findOne({email:body.email},(err,user)=>{
	if(err){
		return done(err);
	}
	if(user){
		req.flash('error','Email is already in use!');
		return res.redirect('/users/user/create');
	}
		
	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/users/user/create');
	}

		
    delete body['_csrf','conf_password'];
	
	if(req.files){
        if(Object.keys(req.files).length == 0){
            return res.status(400).send('No files were uploaded.');
        }

        if(req.files.photo){
            let sampleFile = req.files.photo;
            var image_ext = (sampleFile.mimetype).split('/')[1];
            
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(image_ext);
            if(mimetype && image_ext){
            }else{
                req.flash('error', 'Error : Images Only');
                return res.redirect('/users/user/create');
            }
            
            var filename = 'Avatar-' + Date.now() + '.' + image_ext;
            var filelocation = __basedir + '/public/uploads/' + filename;
            body.photo = filename;
            sampleFile.mv(filelocation, function(err) {
                if (err)
                return res.status(500).send(err);
            });
        }
    }
    var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
    body.api_token = crypto.createHash('sha1').update(current_date + random).digest('hex');
    var nsUser = new User();
    body.password = nsUser.encryptPassword(body.password);
    
	var newUser = new User(body);
		
	newUser.save((err,result)=>{
			if(err) {
				console.log(err);
				for(var key in err.errors){
					req.flash('error', err.errors[key].message);
				}
				res.redirect('/users/user/create');
			} else { 
				req.flash('success',"User Created Successfully!");
				res.redirect('/users/user');
			}
		});
	});
};



exports.edit = function(req, res,next) {
    var id = req.params.id
    
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

    var data = {
		title:'Zeligz | Users',
		layout:'admin/defaultLayout',
    	csrfToken: req.csrfToken(),
    	successMsg: successMsg,
    	errorMsg: errorMsg,
	};

    User.findById(id,(errors,user)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('/users/user')
		}
		data.user = user
		data.id = id

		res.render('users/user/edit',data)

    })



};

exports.update = function(req, res,next) {
    	var id = req.params.id
		
   //validating the field
	var body = req.body;
    req.checkBody('name','Name is required!').notEmpty();
	req.checkBody('email','Email is required!').notEmpty()
	req.checkBody('mobile','Mobile number is required!!').notEmpty()
	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
			return res.redirect('/users/user/'+id+'/edit');
	}
		
		
	
	delete body['_csrf'];
	
	if(req.files){
        if(Object.keys(req.files).length == 0){
            return res.status(400).send('No files were uploaded.');
        }

        if(req.files.photo){
            let sampleFile = req.files.photo;
            var image_ext = (sampleFile.mimetype).split('/')[1];
            
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(image_ext);
            if(mimetype && image_ext){
            }else{
                req.flash('error', 'Error : Images Only');
                return res.redirect('profile');
            }
            
            var filename = 'Avatar-' + Date.now() + '.' + image_ext;
            var filelocation = __basedir + '/public/uploads/' + filename;
            body.photo = filename;
            sampleFile.mv(filelocation, function(err) {
                if (err)
                return res.status(500).send(err);
            });
        }
    }else{
		 body.photo = body.oldphoto
	}
	var newUser = new User()
	if(body.password ==''){
	 body.password =  body.oldpassword
	}else{
	body.password = newUser.encryptPassword(body.password);
	}
	delete  body.oldpassword;
	delete  body.oldphoto;
	delete  body.email;	
	User.updateOne({_id:id},{ $set : body},(err,result)=>{
			if(err) {
				console.log(err);
				for(var key in err.errors){
					req.flash('error', err.errors[key].message);
				}
				return res.redirect('/user/user/'+id+'/edit');
			} else { 
				req.flash('success',"User details udpated Successfully!");
				res.redirect('/users/user');
			}
		});
	//});

};

exports.destroy = function(req, res,next) {
    var id =  req.params.id

	User.findByIdAndRemove(id,(errors,result)=>{
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
	    	messages : ["Record delete successfully!"]
	    }
	    return res.send(response);
    })

    
};





