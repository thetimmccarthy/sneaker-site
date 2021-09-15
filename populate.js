#! /usr/bin/env node

console.log('This script populates some test sneakers, brands, and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
const bcrypt = require('bcrypt');
var Item = require('./models/item')
var Brand = require('./models/brand')
var Category = require('./models/category')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []
var brands = []
var users = []

function categoryCreate(name, desc, cb) {
  var category = new Category({ name: name});
  if (desc != false) category.desc = desc;
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    
    cb(null, category);
  }   );
}

function brandCreate(name, headquarters, desc, cb) {
  branddetail = { 
    name: name,
    headquarters: headquarters,
  }

  if (desc != false) branddetail.desc = desc;
    
  var brand = new Brand(branddetail);    
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand);
    
    cb(null, brand)
  }  );
}
// name, desc, category, brand, price, size, likes, owner
function itemCreate(name, desc, category, brand, price, size, likes, owner, cb) {
    itemdetail = {name: name, desc:desc, category:category, brand:brand, price:price, size:size, likes:likes, owner: owner}
    
    var item = new Item(itemdetail);
         
    item.save(function (err) {
      if (err) {
        // cb(err, null)
        // return
        console.error(err)
        
      }
      console.log('New item: ' + item);
      items.push(item)
      cb(null, item)
    }  );
  }

async function userCreate(username, password, cb) {
  const encryptedPW = await bcrypt.hash(password, 10);
  userDetail = {username: username, password: encryptedPW} 

  var user = new User(userDetail);

  user.save(err => {
    if (err) {
      console.error(err);
      cb(err, null);
    }

    users.push(user);
    cb(null, user)
  })
}

function createCategoriesBrandsUsers(cb) {
    async.series([
        function(callback) {
            categoryCreate("Sneaker", false, callback);
        },
        function(callback) {
            categoryCreate("Running", false,callback);
        },
        function(callback) {
            categoryCreate("Crosstrainer", false, callback);
        },
        function(callback) {
            brandCreate('Nike', 'Eugene, OR', 'Iconic American athletic shoe brand', callback)
        },
        function(callback) {
            brandCreate('Adidas', 'Germany', 'German sports brand', callback)
        },
        function(callback) {
          userCreate('tim1', 'abcdef', callback)
        },
        function(callback) {
          userCreate('serg2', 'loser', callback)
        },
        function(callback) {
          userCreate('adam3', 'brother', callback)
        }],
        // optional callback
        cb)
}

//    x     x     x         x     x     x     x       x
// name, desc, category, brand, price, size, likes, owner
function createItems(cb) { 
    async.series([
        function(callback) {
            itemCreate('Ultraboost', 'An Adidas classic', categories[0], brands[1], 180, 10, 0, users[0], callback);
        },
        function(callback) {
            itemCreate('React', 'High Quality Nike Running Shoes', categories[1], brands[0], 100, 10, 0, users[2], callback); 
        },
        function(callback) {
            itemCreate('Jordan 1', 'First Edition Jordans', categories[0], brands[0], 200, 10, 0, users[1], callback); 
        },
        function(callback) {
            itemCreate('Metcon Free', "Nike's best CrossFit shoe", categories[2], brands[0], 100, 9.5, 0, users[0], callback);             
        },
],
        cb);
}

const creatingItemsCallback = function(err, results) {

    if (err) {
        console.error(err)
    }
    else {
        console.log(results)
        console.log('Done')
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
}

async.series([
    createCategoriesBrandsUsers, 
    createItems
],
// Optional callback
    creatingItemsCallback
);



