var async = require('async');
const https = require('https');

exports.index = async function(req, res) {
	var data = {
		page:'home',
	}
	res.render(req.theme+'/layouts/index',data);
}

exports.test = function(req, res) {
	var data = {
		page:'test',
	}
	res.render(req.theme+'/layouts/index',data);
}