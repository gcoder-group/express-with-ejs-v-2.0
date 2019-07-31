var csrf = require('csurf')
var express = require('express');
var auth_middleware = require('../../../middlewares/users/auth.js')
var permission_controller = require('../../../controllers/users/access/permissionController');

var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)


//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInUser,(req,res,next)=>{
  next()
})

router.get('/',permission_controller.index)

router.get('/create',permission_controller.create)

router.post('/',permission_controller.store)

router.get('/:id/edit',permission_controller.edit)

router.put('/:id',permission_controller.update)


router.delete('/:id',permission_controller.destroy)

module.exports = router;