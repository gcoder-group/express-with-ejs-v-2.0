var csrf = require('csurf')
var express = require('express');
var passport = require('passport')
var User = require('../../models/user')
// var Subscribe = require('../../models/subscribe')
// var Contact = require('../../models/contact')

var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)

exports.dashboard = function(req, res,next) {
    (async()=>{
  //       var subscribers = await Subscribe.find(function (error, subscriber){
	 //    	subscribers = subscriber
		// });
		
		// var users = await User.find({role:'client'}, function (error, user){
	 //    	users = user
		// });
			
		// var contacts = await Contact.find({read: 0}, function (error, contact){
	 //    	contacts = contact
		// });
		var data = {
            title:'Dashboard',
            page:'dashboard',
            total_user : 0,//users.length,
            total_subcribers : 0,//subscribers.length,
            total_unread_contacts : 0,//contacts.length
        }
        res.render(req.theme_user+'/layouts/index',data);

    })();
};

exports.profile = function(req, res,next) {
    var errorMsg = req.flash('error');
    var successMsg = req.flash('success')[0];
    console.log(errorMsg)
    User.findById(req.user._id,function(err, u_data){
        if(err){
            return res.redirect('profile');
        }

        var data = {
            title:'Dashboard',
            page:'profile',
            csrfToken: req.csrfToken(),
            errorMsg : errorMsg,
            successMsg : successMsg,
        }
        if(u_data){
            data.u_data = u_data;   
        }
       
        res.render(req.theme_user+'/layouts/index',data);


    });
};


exports.update_profile = function(req, res,next) {
    var body = req.body;
    delete body['_csrf'];
    body.user_id = req.user._id;

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
    }

    var query = {'_id':req.user._id};
    User.findOneAndUpdate(query, body, {upsert:true}, function(err, doc){
        if(err) {
            for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
            
            res.redirect('profile');
        } else { 
                req.flash('success',"Updated successfully!");
            res.redirect('profile');
        }
    });
};


exports.change_password = function(req, res,next) {
    var successMsg = req.flash('success');
    var errorMsg = req.flash('error');
    var data = {
        title:'Change Password',
        page:'change_password',
        csrfToken: req.csrfToken(),
        successMsg: successMsg,
        errorMsg: errorMsg,
    }
    res.render(req.theme_user+'/layouts/index',data);
};


exports.change_password_update = function(req, res,next) {
	var user = req.user;
	var user_id = req.user._id;

	req.checkBody('old_pass','Old password is required!').notEmpty();
	req.checkBody('new_pass','New password is required!').notEmpty()
	req.checkBody('new_pass','Minimum length is 6 characters!').isLength({min:6})
	req.checkBody('conf_pass','Confirm password is required!').notEmpty()
	req.checkBody('conf_pass','Minimum length is 6 characters!').isLength({min:6})

	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('change_password');
	}

	var old_password = req.body.old_pass
	var new_password = req.body.new_pass
	var conf_password = req.body.conf_pass

	if(new_password !== conf_password){
		req.flash('error','Confirm Password do not match to Password');
		return res.redirect('change_password');
	}

	var userModel = new User(req.user);
	if(!userModel.validPassword(old_password)){
		req.flash('error','Wrong Old Password!')
		return res.redirect('change_password');
	}

	var new_password_hash = userModel.encryptPassword(new_password);
	var query = {'_id':user_id};
	var update = { password: new_password_hash };
	

	User.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
	    if (err) {
	    	//return res.send(500, { error: err })
	    	for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
	    	return res.redirect('change_password');
	    };
	    //console.log(doc)
	    req.flash('success',"Password updated successfully!");
	    return res.redirect('change_password');

	})
};


exports.logout = function(req, res,next) {
    req.logout();
	res.redirect('/')
};


