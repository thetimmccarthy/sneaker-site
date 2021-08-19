var mongoose = require('mongoose')

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {type: String, required: true},
    desc: String
});

//  TODO: make sure this has correct URL
categorySchema.virtual('url').get(() => {
    return 'category/' + this._id;
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;

