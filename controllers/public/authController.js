var async = require('async');
const https = require('https');
var User = require('../../models/user')
var crypto = require('crypto')
var nodemailer = require('nodemailer')
var email_helper = require('../../helpers/email_helper')

exports.login =  function(req, res,next) {
	var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

	var data = {
		title: 'Login',
		page:'login',
        csrfToken: req.csrfToken(),
       	captcha_at_login:false,
       	successMsg: successMsg,
        errorMsg: errorMsg,
	}
	res.render(req.theme+'/layouts/auth', data);
}

exports.login_post = function(req, res,next) {
    if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl
		req.session.oldUrl = null
		res.redirect(oldUrl)
	}else{
		var userRole = req.user.role;
		var userType = req.user.user_type;
		if(userType == 'user'){
			res.redirect('/users/dashboard')
		}else if(userType == 'client'){
			res.redirect('/clients/dashboard')
		}else{
			res.redirect('/clients/logout')
		}
		
	}
};

exports.register =  function(req, res,next) {
	var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	var data = {
		title: 'Register',
		page:'register',
        csrfToken: req.csrfToken(),
       	captcha_at_login:false,

       	successMsg: successMsg,
        errorMsg: errorMsg,
	}
	res.render(req.theme+'/layouts/auth', data);
}

exports.register_post = function(req, res,next) {
    
    if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl
		req.session.oldUrl = null
		res.redirect(oldUrl)
		
	}else{
		var userRole = (req.user)?req.user.role:'';
		var user_type = (req.user)?req.user.user_type:'';
		if(req.isAuthenticated() && user_type=='user'){
			res.redirect('/users/dashboard')
		}else{
			res.redirect('/clients/dashboard')
		}
    }
};


exports.forgot = function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	var data = {
		title: 'Forgot password',
		page:'forgot_password',
        csrfToken: req.csrfToken(),
       	captcha_at_forgot:false,

       	successMsg: successMsg,
        errorMsg: errorMsg,
	}

	res.render(req.theme+'/layouts/auth', data);
};

exports.forgot_post = function(req, res,next) {
    async.waterfall([
	    function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
	    },
	    function(token, done) {
	      User.findOne({ email: req.body.email }, function(err, user) {
	        if (!user) {
	          	req.flash('error', 'No account exists with that email address.');
	          	return res.redirect('forgot');
	        }

		  	user.resetPasswordToken = token;
	        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        user.save(function(err) {

	          done(err, token, user);
	        });
	      });
	    },
	    function(token, user, done) {
	    	//sending the mail
			(async()=>{
				var protocol = req.protocol
				var link = protocol+'://' + req.headers.host + '/auth/reset/' + token;
				var data = {
					to: user.email, // list of receivers
					subject: "Zeligz | Password Reset", // Subject line
				    text: '', // plain text body
				    html: '<h3>Hello Dear</h3><br /><div>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br /><br />' +
			          'Please click on the following link, or paste this into your browser to complete the process:<br /><br /><a href="'+link+'">' +
			          link+'</a><br /><br />' +'If you did not request this, please ignore this email and your password will remain unchanged.</div>', // html body 
				}
				
				"use strict";
				var messageId = await email_helper.sendmail(data).catch(console.error);
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.\n');
				console.log(messageId)
				done(null, link);
			})();
	      	
			
     	}
	  ], function(err,done) {
	    if (err) {
	    	//return next(err);
	    	for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
	    	res.redirect('/auth/forgot');	
	    }
	    
	    res.redirect('/auth/forgot');
	});

};

exports.reset = function(req, res,next) {
	var successMsg = req.flash('success');
	var errorMsg = req.flash('error');
	
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		if (!user) {

		  	req.flash('error', 'Password reset token is invalid or has expired.');
		  	return res.redirect('auth/forgot');
		}
		
		var successMsg = req.flash('success');
		var errorMsg = req.flash('error');
		var data = {
			title: 'Reset password',
			page:'reset',
	        csrfToken: req.csrfToken(),
	        successMsg: successMsg,
	        errorMsg: errorMsg,
		}

		res.render(req.theme+'/layouts/auth', data);

	});
};


exports.reset_post = function(req, res,next) {
	async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password !== req.body.conf_password){
        	req.flash('error', 'Confirm password is not equal to new password!');
          return res.redirect('back');
        }
        user.password = user.encryptPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          // req.logIn(user, function(err) {
          //   done(err, user);
          // });
          done(err, user);
        });
      });
    },
    function(user, done) {
     	//sending the mail
		(async()=>{
			var data = {
				to: user.email, // list of receivers
				subject: "Zeligz | Your password has been changed", // Subject line
			    text: '', // plain text body
			    html:  'Hello,<br /><br />' +
  			    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			}
			
			"use strict";
			var messageId = await email_helper.sendmail(data).catch(console.error);
			req.flash('success', 'Success! Your password has been changed.\n');
			console.log(messageId)
			done(null, 'link');
		})();


      	// req.flash('error', 'Success! Your password has been changed.');
       //  done(user);

    }
  ], function(err,user) {
  	//req.user = user
    res.redirect('/auth/login');
  });
};



