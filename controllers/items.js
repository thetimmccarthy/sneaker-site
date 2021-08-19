var itemModel = require('../models/item');
var brandModel = require('../models/brand');
const categoryModel = require('../models/category');
const async = require('async')
const ObjectId = require('mongodb').ObjectID;

exports.index_get = function(req, res, next) {
    itemModel.find().populate('brand').populate('owner').sort({'name': 1}).exec((err, items) => {
        if (err) {
            console.error(err);
            res.render('index', { title: 'Sneakersite'});
        }     
        
        res.render('all_items', { title: 'Sneakersite', items: items });
    })
    
  };

// /items/new -> brings user to page to add new sneaker to list
exports.index_new_get = function(req, res, next) {
    async.parallel({
        brands: function(callback) {
            getBrands(callback);
        },
        categories: function(callback) {
            getCategories(callback);
        }
    }, 
    function(err, results) {
        if(err) {
            console.error(err);
            res.redirect('/');
        }
        
        res.render('new_item', {brands:results.brands, categories: results.categories})
    })
    
}

//  POST /items/new -> adds new sneaker to list of sneakers
exports.index_new_post = function(req, res, next) {
    async.parallel({
        brands: function(callback) {
            getBrands(callback);
        },
        categories: function(callback) {
            getCategories(callback);
        }
    }, 
    function(err, results) {
        if(err) {
            console.error(err);
            res.redirect('/');
        }
        console.log(req.file);
        let name = req.body.name;
        let desc = req.body.desc;
        let category = req.body.category;
        let brand = req.body.brand;
        let price = req.body.price;
        let size = req.body.size;  
        let picturePath = req.file.new_filename
        
        brands = results.brands
        categories = results.categories
        console.log('results ', results)
        
        brandId = null
        categoryId = null

        for (let i = 0; i < brands.length; i++) {
            if (brands[i].name.toLowerCase() === brand.toLowerCase()) {
                brandId = brands[i]._id;
            }
        }

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name.toLowerCase() === category.toLowerCase()) {
                categoryId = categories[i]._id;
            }
        }

        const saveBrand = (cb) => {
            if (!brandId) {
                newBrand = new brandModel({name: brand});
                newBrand.save(function(err) {
                    if (err) {
                        cb(err, null);
                    }
                    cb(null, newBrand._id)
                } 
                ) 
            } else {
                cb(null, brandId)
            }
        }

        const saveCategory = (cb) => {
            if (!categoryId) {
                newCategory = new categoryModel({name: category});
                newCategory.save(function(err) {
                    if (err) {
                        cb(err, null);
                    }
                    cb(null, newCategory._id)
                } 
                ) 
            } else {
                cb(null, categoryId);
            }
        }

        async.parallel({
            cat: function(callback) {
                saveCategory(callback);
            },
            brand: function(callback) {
                saveBrand(callback);
            }
        }, 
        function(err, saveResults) {
            if(err) {
                console.log("ERROR");
                console.error(err);
            }
            
        
        var itemdetail = {name:name, desc:desc, price:price, size:size, brand: ObjectId(saveResults.brand), category: ObjectId(saveResults.cat), owner: ObjectId("610c13053ebc2efed02fdf72"), picture: picturePath}
        var item = new itemModel(itemdetail);
        item.save(err => {
            if (err) {
                console.log('WRONG')
                console.error(err);
                // TODO: add in error statement for when new item is created incorrectly
                
                }
            // res.redirect('/')
            })
        res.redirect('/')
        })
    })
    
}  
    

// Get specific shoe (by id)
exports.index_get_id = function(req, res, next) {
    
    let id = req.params.id
    
    itemModel.find({'_id': id}).populate('brand').populate('category').populate('owner').exec((err, result) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        
        res.render('single_item', {item: result[0]})
    })

}

exports.index_get_id_edit = (req, res, next) => {
    let id = req.params.id;
    itemModel.find({'_id': id}).populate('brand').populate('category').populate('owner').exec((err, result) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        else {
        res.render('add_picture', {item: result[0]})
        }
    })
}

exports.index_post_id_edit = async (req, res, next) => {
    let id = req.params.id;
    let query = {'_id': id}
    let item = await itemModel.findByIdAndUpdate(query, {picture: req.file.new_filename}, {
        new: true
    });
    
    res.redirect(`/item/${id}`);
}

exports.index_delete_id = (req, res, next) => {
    let id = req.params.id;
    let query = {'_id': id};

    itemModel.findOneAndRemove(query, (err, result) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        } else {
            res.redirect('/item')
        }
    });
    
}

// ****************
// Helper functions for running multiple db queries in same route
// ****************
function getBrands(cb) {
    brandModel.find().select('name').exec((err, brands) => {
        if (err) {
            cb(err,null)
            res.redirect('/');
        }

        cb(null, brands);
    })
}

function getCategories(cb) {
    categoryModel.find().select('name').exec((err, categories) => {
        if (err) {
            cb(err,null)
            res.redirect('/');
        }

        cb(null, categories)
    })
}