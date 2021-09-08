var itemModel = require('../models/item');
var brandModel = require('../models/brand');
const categoryModel = require('../models/category');
const userModel = require('../models/user');
const async = require('async')
const ObjectId = require('mongodb').ObjectID;

exports.user_id_get = function(req, res, next) {
    const id = req.params.id
    async.parallel({
        user: function(callback) {
            getUser(id, callback);
        },
        shoes: function(callback){
            getUsersShoes(id, callback);
        }
    },
    function(err, results) {
        if (err) {
            console.error(err);
            
            res.redirect('/');
        }
        res.render('single_user', {user:results.user[0], shoes: results.shoes});
    } 
    )
}

exports.users_get = function(req, res, next) {
    userModel.find().exec((err, results) => {
        if(err) {
          console.error(err);
          res.redirect('/');
        }
        res.render('all_users', {users: results});
      })  
}

function getUser(id, cb) {
    userModel.find({'_id': ObjectId(id)}).exec((err, result) => {
        if (err) {
            console.error(err);
            cb(err, null);
        }
        cb(null, result);
    });
}

function getUsersShoes(id, cb) {
    itemModel.find({'owner': ObjectId(id)}).populate('brand').populate('category').exec((err, results) => {
        if(err) {
            console.error(err);
            cb(err, null);
        }
        cb(null, results)
    })
}