var bcrypt = require('bcrypt-nodejs');
	
	

exports.localRegister = function(req, username, password){
	var hash = bcrypt.hashSync(password);
    var user = {
		"username": username,
		"password": hash,
		"email": username,
		"firstName": req.body.firstName,
		"lastName": req.body.lastName
	}
};

exports.localAuth = function(username, password){
	
};