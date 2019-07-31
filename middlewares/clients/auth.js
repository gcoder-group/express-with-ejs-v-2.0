module.exports = {
    isLoggedInClient : function(req,res,next){
    	var user = req.user
    	if(req.isAuthenticated()){
    	    
    	    if(user.status == 'new'){
    	        return res.redirect('/auth/verify_account')
    	    }
    	    
    		return next()
    	}
    	res.redirect('/auth/login')
    },
    notLoggedInClient : function(req,res,next){
    	if(!req.isAuthenticated()){
    		return next()
    	}
    	res.redirect('/clients/dashboard')
    }

}