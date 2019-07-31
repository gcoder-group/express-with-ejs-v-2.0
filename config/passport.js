var async = require('async');
const https = require('https');
var passport = require('passport')
var crypto = require('crypto');
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy
var config_app = require('../config/app.js')


var common_helper = require('../helpers/common_helper')
var email_helper = require('../helpers/email_helper')

passport.serializeUser((user,done)=>{
	done(null,user.id)
})

passport.deserializeUser((id,done)=>{
	User.findById(id,(err,user)=>{
		done(err,user)
	})
})

passport.use('local.signup',new LocalStrategy({
	usernameField: 'email',
	passwordField : 'password',
	passReqToCallback : true,
},async function(req,email,password,done){
    
	var name  = req.body.name; 
	var mobile  = req.body.mobile;
	
	//var company_info = await common_helper.get_company_setting()
    var CAPTCHA_REGISTER = false;//company_info[0].captcha_client_reg
    
	req.checkBody('name','Invalid name').notEmpty()
	req.checkBody('email','Invalid email').notEmpty().isEmail();
	req.checkBody('password','Invalid password').notEmpty().isLength({min:6})
	

        if(CAPTCHA_REGISTER){
            req.checkBody('g-recaptcha-response','Captcha is required!').notEmpty();
        }
	    var errors = req.validationErrors(); 
    	if(errors){
            
    		var messages = [];
    		errors.forEach(function(error){
    			messages.push(error.msg)
    		})
    		return done(null,false,req.flash('error',messages))
    	}
	
   
        if(CAPTCHA_REGISTER){
    		//captcha validation
    		var secret = `${process.env.RECAPTCHA_SECRET_KEY}`
    		var g_recaptcha_response = req.body['g-recaptcha-response'];
    		var url = 'https://www.google.com/recaptcha/api/siteverify?secret='+secret+'&response='+g_recaptcha_response;
    		async.waterfall([
    		    function(callback) {
    		    	https.get(url, (resp) => {
    					let data = '';
    
    					// A chunk of data has been recieved.
    					resp.on('data', (chunk) => {
    						data += chunk;
    					});
    
    					// The whole response has been received. Print out the result.
    					resp.on('end', () => {
    						var result = JSON.parse(data);
    						if(result && result.success == true){
    							return callback(null, true);
    						}
    						
    					});
    
    				}).on("error", (err) => {
    					console.log("Error on capcha varification : " + err.message);
    					callback(null, false);
    					
    				});
    			},
    		    
    		], function (err, result) {
    			// result now equals 'done'
    			if(result){
    				result = true
    			}
    			
    			validate_reguser(req)
    		});	
    	
    	}else{
    		validate_reguser(req)
    	}
	
    
	
	
	
    function validate_reguser(req){
		User.findOne({email:email},(err,user)=>{
    		if(err){
    			return done(err);
    		}
    		if(user){
    			return done(null,false,{message:'Email is already in use!'})
    		}
    
    		var current_date = (new Date()).valueOf().toString();
    		var random = Math.random().toString();
    		var api_token = crypto.createHash('sha1').update(current_date + random).digest('hex');
    		
    
    		var newUser = new User()
    		newUser.name = name
    		newUser.email = email
    		newUser.password = newUser.encryptPassword(password)
    		newUser.mobile = mobile
    		newUser.api_token = api_token
    		newUser.role = 'admin'
            newUser.user_type = 'user'
    		var verify_account = req.verify_account;
    		
    		
    		if(verify_account == 'false'){
    		   	newUser.status = 'active' 
    		}
    		
    		newUser.save(function(err,result){
    			if(err){
    				console.log(err);
                    return done(err)
    			}
    			
    			if(verify_account == 'true'){
    			    
    		        (async()=>{	
            			var protocol = req.protocol
            			var link = protocol+'://' + req.headers.host + '/auth/verify/' + api_token;
            			var data = {
            				to: email, // list of receivers
            				subject: "Zeligz | Email Verification", // Subject line
            			    text: '', // plain text body
            			    html: 'You are receiving this because you (or someone else) have requested the verify for your account by email.<br /><br />' +
                              'Please click on the following link, or paste this into your browser to complete the process:\n\n<a href="'+link+'">' +
                              link+'</a><br /><br />' +'If you did not request this, please ignore this email and your account is verified.<br />', // html body 
            			}
            			
            			"use strict";
            			var messageId = await email_helper.sendmail(data).catch(console.error);
             	        
            			return done(null,newUser)
        		    })()
    			}else{
    			    console.log('newUser');
                    console.log(newUser);
    			    return done(null,newUser)
    			}
            })
    
    	})
    
	}
	

}))

passport.use('local.signin',new LocalStrategy({
	usernameField: 'email',
	passwordField : 'password',
	passReqToCallback : true,
},async function(req,email,password,done){
	//var company_info = await common_helper.get_company_setting()
    var CAPTCHA_LOGIN = false;//company_info[0].captcha_at_login
        
	req.checkBody('email','Invalid email').notEmpty().isEmail();
	req.checkBody('password','Invalid password').notEmpty().isLength({min:6})
	if(CAPTCHA_LOGIN){
        req.checkBody('g-recaptcha-response','Captcha is required!').notEmpty();
	}
	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		return done(null,false,req.flash('error',messages))
	}
	
	    if(CAPTCHA_LOGIN){
    		//captcha validation
    		var secret = `${process.env.RECAPTCHA_SECRET_KEY}`
    		var g_recaptcha_response = req.body['g-recaptcha-response'];
    		var url = 'https://www.google.com/recaptcha/api/siteverify?secret='+secret+'&response='+g_recaptcha_response;
    		async.waterfall([
    		    function(callback) {
    		    	https.get(url, (resp) => {
    					let data = '';
    
    					// A chunk of data has been recieved.
    					resp.on('data', (chunk) => {
    						data += chunk;
    					});
    
    					// The whole response has been received. Print out the result.
    					resp.on('end', () => {
    						var result = JSON.parse(data);
    						if(result && result.success == true){
    							return callback(null, true);
    						}
    						
    					});
    
    				}).on("error", (err) => {
    					console.log("Error on capcha varification : " + err.message);
    					callback(null, false);
    					
    				});
    			},
    		    
    		], function (err, result) {
    			// result now equals 'done'
    			if(result){
    				result = true
    			}
    			
    			validate_user()
    		});	
    	
    	}else{
    		validate_user()
    	}
	
	
	function validate_user(){
		User.findOne({email:email},(err,user)=>{
    		if(err){
    			return done(err);
    		}
    		if(!user){
    			return done(null,false,{message:'No user found!'})
    		}
    		if(user.status != 'active'){
    			return done(null,false,{message:'User is not activated'})
    		}
    		
    		if(!user.validPassword(password)){
    			return done(null,false,{message : 'Wrong Password!'})
    		}
    		
    		return done(err,user)
    
    	})
	}


}))

