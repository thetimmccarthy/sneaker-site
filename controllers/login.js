const userModel = require('../models/user');
const async = require('async');
const bcrypt = require('bcrypt');
const { title } = require('./naming')
exports.login_get = (req, res) => {
    res.render('login', {title: title})
}


exports.login_post = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    

    userModel.find({'username': username}).exec(async (err, user) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        
        const passwordsMatch = await bcrypt.compare(password, user[0].password);

        if(passwordsMatch) {
            
            req.session.username = username;
            res.redirect('/');

            
        } else { 
            errors = [{
                msg: 'Email not registered, please create an account.'
            }]
            res.render('login', {title: title, errors: errors}); 
        }
    })
}