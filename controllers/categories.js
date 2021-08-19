var itemModel = require('../models/item');
var brandModel = require('../models/brand');
const categoryModel = require('../models/category');
const async = require('async')
const ObjectId = require('mongodb').ObjectID;

exports.index_get = function(req, res, next) {
    categoryModel.find().populate('owner').populate('brand').exec((err, results) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }

        res.render('categories', {categories: results})
    })
}

exports.index_get_id = function(req, res, next) {

    let id = req.params.id
    console.log(id)
    itemModel.find({category: ObjectId(id)}).populate('brand').populate('owner').exec((err, result) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        console.log(result)
        res.render('single_category', {items: result})
    })

}