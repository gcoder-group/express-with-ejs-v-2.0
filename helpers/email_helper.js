var nodemailer = require('nodemailer')
var config_app = require('../config/app.js')
var emailTemplateModel = require('../models/users/emailTemplate');


module.exports = {
	
	// async..await is not allowed in global scope, must use a wrapper
	sendmail : async function(data){
		// create reusable transporter object using the default SMTP transport
	  let transporter = nodemailer.createTransport({
	    host: config_app.SMTP_HOST,
	    port: config_app.SMTP_PORT,
	    secure: true, // true for 465, false for other ports
	    auth: {
	      user: config_app.SMTP_USER, // generated ethereal user
	      pass: config_app.SMTP_PASSWORD // generated ethereal password
	    }
	  });

	  // send mail with defined transport object
	  let info = await transporter.sendMail({
	    from: '"'+config_app.FROM_NAME+'" <'+config_app.FROM_EMAIL+'>', // sender address
	    to: data.to, // list of receivers
	    subject: data.subject, // Subject line
	    //text: data.text, // plain text body
	    html: data.html // html body
	  });

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		return info.messageId;
	  
	},
	
	email_template : async(id)=>{
		var templateInfo = null
		await emailTemplateModel.findById(id,(errors,doc)=>{
	    	if(errors){
				templateInfo = null
			}
			templateInfo = doc
		})
		return templateInfo
	},
}