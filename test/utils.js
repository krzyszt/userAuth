'use strict';

var db = require('../config/db');
var mongoose = require('mongoose');

beforeEach(function(done) {
    
    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {
            });
        }
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(db.test, function(err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


afterEach(function(done) {
    mongoose.disconnect();
    return done();
});

