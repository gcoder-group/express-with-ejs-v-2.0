var csrf = require('csurf')
var express = require('express');
var passport = require('passport')
var dashboard_controller = require('../../controllers/clients/dashboardController');
var auth_middleware = require('../../middlewares/clients/auth.js')


var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)

router.get('/logout',dashboard_controller.logout)

//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInClient,(req,res,next)=>{
	next()
})


/* loading the dashboard page*/
router.get('/dashboard',dashboard_controller.dashboard)

/*load the user profile page*/
router.get('/profile',dashboard_controller.profile)

/* process user profile request*/
router.post('/profile',dashboard_controller.update_profile)

/* loading the change_password page*/
router.get('/change_password',dashboard_controller.change_password)

/* process change_password request*/
router.post('/change_password',dashboard_controller.change_password_update)


module.exports = router;
