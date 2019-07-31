var Banner = require('../../models/users/role')
//var slugify = require('slugify')
var async = require('async');



/*Load the page to show the list*/
exports.index = function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

    
	var data = {
        title:'Banners',
        page:'banner/index',
        csrfToken: req.csrfToken(),
        errorMsg : errorMsg,
        successMsg : successMsg,
    }

	var banner = Banner.find(function (err,banners){
	    if(err){
	    	data.banner = {}
	    	data.hasBanner = false
	    	res.render('admin/banner/index',data)
	    }
	    data.banners = banners
	    data.hasBanner = true
	    
	    res.render(req.theme_user+'/layouts/index',data);
	});
    
};


exports.create = function(req, res,next) {
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

    var data = {
		title:'Zeligz | Dashboard',
		layout:'admin/defaultLayout',
    	csrfToken: req.csrfToken(),
    	successMsg: successMsg,
    	errorMsg: errorMsg,
    };
	
    res.render('admin/banner/entry',data)
};

exports.store = function(req,res,next) {
	//validating the field
    req.checkBody('banner_title','Title is required!').notEmpty();
	req.checkBody('banner_content','Benner Content is required!').notEmpty()
	//req.checkBody('banner_image','Image is required!!').notEmpty()
	if(!req.files){

		req.flash('error', 'Image is required!!');
		return res.redirect('/admin/banner/create');
	}

	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/admin/banner/create');
	}

	var newBanner = new Banner()
	newBanner.banner_title = req.body.banner_title
	newBanner.banner_content = req.body.banner_content
	newBanner.banner_image = req.body.banner_image
	newBanner.banner_status = req.body.banner_status
	

	/*var slug = slugify(req.body.name, {
	  replacement: '-',    // replace spaces with replacement
	  remove: null,        // regex to remove characters
	  lower: true          // result in lower case
	})
	var count = 0;
	unique_slug(slug,count,req.body.name,callback);*/


	if(req.files){
        if(Object.keys(req.files).length == 0){
            return res.status(400).send('No files were uploaded.');
        }

        if(req.files.banner_image){

        	var image_name = req.files.banner_image.name
    		img_name = image_name.split('.')[0];

            let sampleFile = req.files.banner_image;

            var image_ext = (sampleFile.mimetype).split('/')[1];
            
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(image_ext);

            if(mimetype && image_ext){
            }else{
                req.flash('error', 'Error : Images Only');
                return res.redirect('/admin/page/create');
            }
            
            var filename = 'banner-'+ img_name + Date.now() + '.' + image_ext;
			var filelocation = __basedir + '/public/uploads/' + filename;
             
            newBanner.banner_image = filename;
            sampleFile.mv(filelocation, function(err) {
                if (err)
                return res.status(500).send(err);
            });
        }
    }


	newBanner.save((errors,page)=>{
			
			if(errors){
				var messages = [];
				errors.forEach(function(error){
					messages.push(error.msg)
				})
				req.flash('error',messages);
				return res.redirect('back')
			}

			var message = "Banner Added successfully!"
			req.flash('success',message)

			return res.redirect('/admin/banner')
		})



    //newPage.feature_image = filename

	/*function callback(isSlugUnique,count,name,resSlug){
		if(!isSlugUnique){
			newSlug = slugify(name+count, {
			  replacement: '-',    // replace spaces with replacement
			  remove: null,        // regex to remove characters
			  lower: true          // result in lower case
			})
			return unique_slug(newSlug,count,name,callback)
			count++;
		}
		newPage.slug = resSlug+'.html'; 

		
	}*/
};



/*function unique_slug(slug,count,name,callback){
	Page.findOne({slug:slug+'.html'},(err,page)=>{
		if(err){
			return callback(true,count,name,slug);
		}else{
			count++
			if(page){
				return callback(false,count,name,slug);
			}
			return callback(true,count,name,slug);
		}
	})	
}


exports.show = function(req, res,next) {
    
}; */

exports.edit = function(req, res,next) {
    var id = req.params.id
    
    var successMsg = req.flash('success');
	var errorMsg = req.flash('error');

    var data = {
		title:'Zeligz | Dashboard',
		layout:'admin/defaultLayout',
    	csrfToken: req.csrfToken(),
    	successMsg: successMsg,
    	errorMsg: errorMsg,
	};




    Banner.findById(id,(errors,banner)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})
			req.flash('error',messages);
			return res.redirect('/admin/banner')
		}
		data.banner = banner
		data.id = id

		res.render('admin/banner/edit',data)

    })



};

exports.update = function(req, res,next) {
    
    //validating the field
    req.checkBody('banner_title','Title is required!').notEmpty();
	req.checkBody('banner_content','Benner Content is required!').notEmpty()

	var id = req.params.id

	var errors = req.validationErrors(); 
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg)
		})
		req.flash('error',messages);
		return res.redirect('/admin/banner/'+id+'/edit');
	}

	var query = {'_id':id};
	var update = { 
		banner_title: req.body.banner_title,
		banner_content: req.body.banner_content,
		banner_status: req.body.banner_status,
		updated_at: Date.now(),
	};

	if(req.files){
        if(Object.keys(req.files).length == 0){
            return res.status(400).send('No files were uploaded.');
        }

        if(req.files.banner_image){

        	var image_name = req.files.banner_image.name
    		img_name = image_name.split('.')[0];
            let sampleFile = req.files.banner_image;

            var image_ext = (sampleFile.mimetype).split('/')[1];
            
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(image_ext);

            if(mimetype && image_ext){
            }else{
                req.flash('error', 'Error : Images Only');
                return res.redirect('/admin/page/'+id+'/edit');
            }
            
            var filename = 'page-'+ img_name + Date.now() + '.' + image_ext;
			var filelocation = __basedir + '/public/uploads/' + filename;
             
            update.banner_image = filename;
            sampleFile.mv(filelocation, function(err) {
                if (err)
                return res.status(500).send(err);
            });
        }
    }


	Banner.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
	    if (err) {
	    	//return res.send(500, { error: err })
	    	for(var key in err.errors){
                req.flash('error', err.errors[key].message);
            }
	    	return res.redirect('/admin/banner/'+id+'/edit');
	    };
	    //console.log(doc)
	    req.flash('success',"Banner updated successfully!");
	    return res.redirect('/admin/banner');

	})


};

exports.destroy = function(req, res,next) {
    var id =  req.params.id

	Banner.findByIdAndRemove(id,(errors,result)=>{
    	if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg)
			})

			var response = {
		    	status: 201,
		    	messages : messages,
		    }
		    return res.send(response);
		}

		var response = {
	    	status: 200,
	    	messages : ["Banner delete successfully!"]
	    }
	    return res.send(response);
    })

    
};





