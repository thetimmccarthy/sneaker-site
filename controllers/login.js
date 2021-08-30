const userModel = require('../models/user');
const async = require('async');
const bcrypt = require('bcrypt');

exports.login_get = (req, res) => {
    res.render('login')
}


exports.login_post = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    

    userModel.find({'username': username}).exec((err, user) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        console.log(user)
        console.log(password, user[0].password)
        const passwordsMatch = password === user[0].password;
        // const passwordsMatch = await bcrypt.compare(password, user.password);

        if(passwordsMatch) {
            
            req.session.username = username;
            console.log(req.session);
            res.redirect('/');

            
        } else { 
            errors = [{
                msg: 'Email not registered, please create an account.'
            }]
            res.render('login', {errors: errors}); 
        }
    })
}