var csrf = require('csurf')
var express = require('express');
var passport = require('passport')
var auth_middleware = require('../../middlewares/users/auth.js')

var dashboard_controller = require('../../controllers/users/dashboardController');
// var companysetting_controller = require('../../controllers/admin/companysettingController');
// var contact_controller = require('../../controllers/admin/contactController');
// var subscribe_controller = require('../../controllers/admin/subscribeController');

var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)


//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInUser,(req,res,next)=>{
	next()
})


// /* loading the dashboard page*/
router.get('/dashboard',dashboard_controller.dashboard)

/*load the user profile page*/
router.get('/profile',dashboard_controller.profile)

/* process user profile request*/
router.post('/profile',dashboard_controller.update_profile)

// /* loading the change_password page*/
router.get('/change_password',dashboard_controller.change_password)

/* process change_password request*/
router.post('/change_password',dashboard_controller.change_password_update)


router.get('/logout',dashboard_controller.logout)



// /*loading the company setting page*/
// router.get('/companysetting',companysetting_controller.createform)

// /*process the company setting page*/
// router.post('/companysetting',companysetting_controller.store)


// router.get('/contactus',contact_controller.contactus)
// router.delete('/contactus/:id',contact_controller.destroy)
// router.post('/contactus/:id',contact_controller.read)

// router.get('/subscribe', subscribe_controller.subscribe)
// router.delete('/subscribe/:id',subscribe_controller.destroy)



module.exports = router;
