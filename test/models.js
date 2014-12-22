var utils = require('./utils');
var should = require('should');
var User = require('../models/User');

describe('Testing Users: models', function() {

    describe('#create()', function() {
        it('should create a new user', function(done) {
            var newUserObj = {
                username: 'j.dummy@test.com',
                password: 'password',
                email: 'j.dummy@test.com',
                firstName: 'John',
                lastName: 'Dummy'
            };
            
            newUser = new User(newUserObj);
            newUser.save(function(err,item){
                should.not.exist(err);
                item.username.should.equal('j.dummy@test.com');
                item.password.should.equal('password');
                item.email.should.equal('j.dummy@test.com');
                item.firstName.should.equal('John');
                item.lastName.should.equal('Dummy');
            });
            done();
        });

    });

});