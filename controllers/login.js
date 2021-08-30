const userModel = require('../models/user');
const async = require('async');
const bcrypt = require('bcrypt');

exports.login_get = (req, res) => {
    res.render('login')
}


exports.login_post = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    

    userModel.find().exec((err, user) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        const passwordsMatch = password === user.password;
        // const passwordsMatch = await bcrypt.compare(password, user.password);

        if(passwordsMatch) {
            req.sessions.username = username;
            res.redirect('/');

            
        } else { 
            errors = [{
                msg: 'Email not registered, please create an account.'
            }]
            res.redirect('/login', {error: errors}); 
        }
    })
}