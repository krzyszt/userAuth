var bcrypt = require('bcrypt-nodejs'),
	Q = require('q'),
	config = require('./config'),
	db = require('orchestrate')(config.db);

exports.localRegister = function(req, username, password){
	var deferred = Q.defer();
	var hash = bcrypt.hashSync(password);
	var user = {
		"username": username,
		"password": hash,
		"email": username,
		"firstName": req.body.firstName,
		"lastName": req.body.lastName
	}
	console.log("New user");
	console.log(user);

	db.get('local-users', username)
		.then(function(result){
			console.log('username: ' + username + ' already exists');
			deferred.resolve(false);
		})
		.fail(function(result){
			console.log(result.body);
			if (result.body.message == "The requested items could not be found."){
				console.log('Username: ' + username + ' is free to use');
				db.put('local-users', username, user)
					.then(function(){
						console.log('User: ' + user);
						deferred.resolve(user);
					})
					.fail(function(err){
						console.log('PUT FAIL: ' + err.body);
						deferred.reject( new Error(err.body));
					});
			} else {
				deferred.reject(new Error(result.body));
			}
		});

	return deferred.promise;
};

exports.localAuth = function(username, password){
	var deferred = Q.defer();
};