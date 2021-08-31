var itemModel = require('../models/item');
var brandModel = require('../models/brand');
const categoryModel = require('../models/category');
const userModel = require('../models/user');
const async = require('async')

exports.index_get = function(req, res, next) {
    async.parallel({
        items: function(callback) {
            getItems(callback);
        },
        users: function(callback) {
            getUsers(callback);
        },
        categories: function(callback) {
            getCategories(callback);
        },
        brands: function(callback) {
            getBrands(callback);
        }
    },
    function(err, results) {
        const session = req.session.username !== undefined ? true : false
        if (err) {
            console.error(err);
            res.render('index', {title: 'Sneakersite'})
        }
        res.render('index', {title: 'Sneakersite', items:results.items, users:results.users, categories:results.categories, brands:results.brands, session: session})
    }
    )
    
  };


// ****************
// Helper functions for running multiple db queries in same route
// ****************
function getBrands(cb) {
    brandModel.find().select('name').exec((err, brands) => {
        if (err) {
            cb(err,null)
            
        }

        cb(null, brands);
    })
}

function getCategories(cb) {
    categoryModel.find().select('name').exec((err, categories) => {
        if (err) {
            cb(err,null)
            
        }

        cb(null, categories)
    })
}

function getUsers(cb) {
    userModel.find().limit(10).exec((err, users) => {
        if (err) {
            console.log('NO USERS SORRY')
            cb(err, null);
        }

        cb(null, users);
    })
}

function getItems(cb) {
    itemModel.find().populate('brand').populate('owner').limit(10).sort({'name':1}).exec((err, items) => {
        if (err) {
            console.error(err);
        }     
        cb(null, items)
    });
}