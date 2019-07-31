var csrf = require('csurf')
var express = require('express');
var auth_middleware = require('../../middlewares/users/auth.js')
var banner_controller = require('../../controllers/users/bannerController');

var router = express.Router();
var csrfProtection = csrf()

router.use(csrfProtection)


//Adding the  loggedin meddleware
router.use('/',auth_middleware.isLoggedInUser,(req,res,next)=>{
  next()
})

router.get('/',banner_controller.index)

router.get('/create',banner_controller.create)

router.post('/',banner_controller.store)

router.get('/:id/edit',banner_controller.edit)

router.put('/:id',banner_controller.update)


router.delete('/:id',banner_controller.destroy)

module.exports = router;