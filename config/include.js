
module.exports = {
	package : ()=>{
		var createError = require('http-errors');
		var express = require('express');
		var path = require('path');
		var cookieParser = require('cookie-parser');
		var logger = require('morgan');

		var dotenv = require('dotenv');
		var bodyParser = require('body-parser')
		var methodOverride = require('method-override')
		var mongoose = require('mongoose')
		var session = require('express-session')
		var passport  = require('passport')
		var flash = require('connect-flash')
		var validator = require('express-validator')
		var MongoStore = require('connect-mongo')(session)
		var fileUpload = require('express-fileupload');
		var csrf = require('csurf')

		var common_helper = require('.././helpers/common_helper')
		require('.././config/passport')
		var db = require('.././config/database')
	}
}