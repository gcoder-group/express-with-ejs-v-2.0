module.exports = {
	routes : (app)=>{
		var indexRouter = require('./public/index');
		app.use('/', indexRouter);

		var authRouter = require('./public/auth');
		app.use('/auth', authRouter);

		var userIndexRouter = require('./users/index');
		app.use('/users', userIndexRouter);

		var userBannerRouter = require('./users/banner');
		app.use('/users/banner', userBannerRouter);

		var userpermissionRoute = require('./users/access/permissionRoute');
		app.use('/users/permission', userpermissionRoute);

		var userRolesRoute = require('./users/access/roleRoute');
		app.use('/users/roles', userRolesRoute);

		var userUsersRoute = require('./users/access/userRoute');
		app.use('/users/user', userUsersRoute);
		
		var clientIndexRouter = require('./clients/index');
		app.use('/clients', clientIndexRouter);
	}
}