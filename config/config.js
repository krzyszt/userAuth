//===================== MongoDB config =========================================
var mongoose = require('mongoose');
var db = require('./db');

module.exports = function(env) {
    var dbURI = db[env];
    
    mongoose.connect(dbURI);

    mongoose.connection.on('connected', function() {
        console.log('Mongoose default connection open to ' + dbURI);
    });

    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function() {
//        console.log('Mongoose default connection disconnected');
    });

    process.on('SIGIN', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
};

//====================== Mongoose Models =======================================
require('../models/User');
