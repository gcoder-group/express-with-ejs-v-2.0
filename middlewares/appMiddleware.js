
var dotenv = require('dotenv');

module.exports = {
	app  : (req, res, next)=>{
		dotenv.config();
		req.theme = `${process.env.THEME}`;
		req.theme_client = `${process.env.THEME_CLIENT}`
		req.theme_user = `${process.env.THEME_USER}`
		req.verify_account = `${process.env.VERIFY_ACCOUNT}`

		res.locals.baseUrl = `${process.env.BASE_URL}`;
		req.company_name = res.locals.company_name = `${process.env.Company_Name}`;

		res.locals.login = req.isAuthenticated();
		res.locals.session = req.session;
		res.locals.user = req.user;
		res.locals.company_setting = {};

		var d = new Date();
		var fullYear = d.getFullYear();
		res.locals.fullYear = fullYear;
		next();

	}

}