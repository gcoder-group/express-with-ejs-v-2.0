var csrf = require('csurf')
var express = require('express');
var auth_middleware = require('../../../middlewares/users/auth.js')
var user_controller = require('../../../controllers/users/access/userController');

var router = express.Router();
var csrfProtection = csrf()



router.use(csrfProtection)


//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInUser,(req,res,next)=>{
	next()
})


/* loading the dashboard page*/
router.get('/',user_controller.index)

router.get('/create',user_controller.create)

router.post('/',user_controller.store)

router.get('/:id/edit',user_controller.edit)

router.put('/:id',user_controller.update)


router.delete('/:id',user_controller.destroy)


module.exports = router;
