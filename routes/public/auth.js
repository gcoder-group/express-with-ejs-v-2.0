var express = require('express');
var csrf = require('csurf')
var passport = require('passport')

var auth_controller = require('../../controllers/public/authController')
var auth_middleware = require('../../middlewares/clients/auth.js')


var router = express.Router();
var csrf = require('csurf')

var csrfProtection = csrf()

router.use(csrfProtection)

//Adding the not  loggedin meddleware
router.use('/',auth_middleware.notLoggedInClient,(req,res,next)=>{
    next()
})


/* GET login page. */
router.get('/login',auth_controller.login);

/* Execute the login request */
router.post('/login',passport.authenticate('local.signin',{
    //successRedirect : '/user/profile',
    failureRedirect : '/auth/login',
    failureFlash : true,
}),auth_controller.login_post);



router.get('/register',auth_controller.register);
router.post('/register',passport.authenticate('local.signup',{
	//successRedirect : '/user/profile',
	failureRedirect : '/auth/register',
	failureFlash : true,
}),function(req, res,next){
    
    var verify_account = req.verify_account;
    
    if(verify_account == 'true'){
        
        return res.redirect('/auth/verify_account')
        //auth_controller.verify_account(req,res,next)
    }else{
        auth_controller.register_post(req,res,next)
    }
    
});

router.get('/forgot',auth_controller.forgot);

router.post('/forgot',auth_controller.forgot_post);
router.get('/reset/:token',auth_controller.reset);
router.post('/reset/:token',auth_controller.reset_post);


module.exports = router;
