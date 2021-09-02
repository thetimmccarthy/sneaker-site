const require_login = (req, res, next) => {
    if(req.session.username) {
        next()
    } else {
        res.render('prompt_login_register');
    }

}

module.exports = {
    require_login
}