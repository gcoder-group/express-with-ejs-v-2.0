module.exports = {

	isLoggedInUser : function(req,res,next){
		var userRole = (req.user)?req.user.role:'';
		var user_type = (req.user)?req.user.user_type:'';
		if(req.isAuthenticated() && user_type=='user'){
			return next()
		}
		res.redirect('/')
	},

	notLoggedInUser : function(req,res,next){
		if(!req.isAuthenticated()){
			return next()
		}
		res.redirect('/users/dashboard')
	}

}