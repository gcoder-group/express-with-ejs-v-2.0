var csrf = require('csurf')
var express = require('express');
var auth_middleware = require('../../../middlewares/users/auth.js')
var role_controller = require('../../../controllers/users/access/roleController');

var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)


//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInUser,(req,res,next)=>{
  next()
})

router.get('/',role_controller.index)

router.get('/create',role_controller.create)

router.post('/',role_controller.store)

router.get('/:id/edit',role_controller.edit)

router.put('/:id',role_controller.update)


router.delete('/:id',role_controller.destroy)

module.exports = router;