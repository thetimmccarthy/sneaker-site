const userModel = require('../models/user');
const async = require('async');
const bcrypt = require('bcrypt');

exports.register_get = (req, res) => {
    res.render('register')
}


exports.register_post = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userModel.find({'username': username}).exec(async (err, user) => {        
        if (err) {
            console.error(err);
            res.redirect('/');
        }

        if (user.length > 0) {
            errors = [{
                msg: 'Username already in use, please choose a different username.'
            }]
            res.render('register', {errors: errors}); 
        } else {
            const encryptedPW = await bcrypt.hash(password, 10);
            const userDetail = {username: username, password: encryptedPW}

            const newUser = new userModel(userDetail);
            newUser.save((err) => {
                if(err) {
                    console.error(err);
                    errors = [{
                        msg: 'Error - Please Try Again'
                    }]
                    res.render('register', {errors: errors}); 
                }
            });

            req.session.username = username;
            res.redirect('/');
        }
    })
}